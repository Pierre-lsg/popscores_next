import { championshipStore } from '$lib/stores/championship/championshipsStore.svelte';
import { mpsStore } from '$lib/stores/championship/markedPointScaleStore.svelte';
import { playersChampionshipStore } from '$lib/stores/championship/playersChampionshipStore.svelte';
import { competitionsStore } from '$lib/stores/championship/competitionsStore.svelte';
import { coursesChampionshipStore } from '$lib/stores/championship/coursesChampionshipStore.svelte';
import { regulationsStore } from '$lib/stores/championship/regulationsStore.svelte';
import { teamsCompetitionStore } from '$lib/stores/championship/teamsCompetitionStore.svelte';
import { resultsCompetitionStore } from '$lib/stores/championship/resultsCompetitionStore.svelte';
import { messageStore } from '$lib/stores/appEventStore.svelte';

import {
	cloudLoadCompetitionsChampionship,
	teamsForDoubleRanking,
	cloudLoadCurrentCompetitionForSupervisor
} from './competitionsFunctions.svelte';
import { cloudLoadChampionshipsClubs } from './clubsFunctions.svelete';
import { userService } from '../pocketbase/users2Cloud';
import { isCompetitionTeam } from './competitionsFunctions.svelte';
import { smartSort } from '../sharedFunction';
import { getRankedPlayers, getRankedTeams } from '../session/golfScoringFunction.svelte';

import type { User } from '$lib/types/userType';
import type { Championship } from '$lib/types/championshipType';
import type { Ranking } from '$lib/types/championshipType';
import type { MarkedPointScale } from '$lib/types/markedPointScaleType';
import type { Course } from '$lib/types/courseType';
import type { Target } from '$lib/types/targetType';
import type { Regulations } from '$lib/types/regulationsType';
import type { Regulation } from '$lib/types/regulationsType';
import type { RankedPlayer } from '$lib/types/playerType';
import type { RankedTeam } from '$lib/types/teamType';
import type { Competition } from '$lib/types/competitionType';
import { clubsStore } from '$lib/stores/championship/clubsStore.svelte';
import { championshipService } from '../pocketbase/championships2Cloud';

/**
 * Fetches users with the 'marshall' role and returns them as supervisors.
 * @returns Promise<User[]> - Array of supervisor users.
 */
export const getSupervisors = async (cs: Championship) => {
	let supervisors: User[] = await userService.getUsersByRoleAndChampionship('marshall', cs.id);

	return supervisors;
};

export const getCsMgrs = async (cs: Championship) => {
	const csMgrs: User[] = await userService.getUsersByRoleAndChampionship('csMgr', cs.id);

	return csMgrs;
};

export const getCpMgrs = async (cs: Championship) => {
	const cpMgrs: User[] = await userService.getUsersByRoleAndChampionship('cpMgr', cs.id);

	return cpMgrs;
};

export const loadAChampionship = async (
	csId: string,
	userId: string,
	userRole: string
): Promise<Championship | undefined> => {
	//championshipStore.reset();
	//mpsStore.reset();
	let aChampionship: Championship | undefined;

	const tmpChampionship = await championshipService.getByChampionshipId(csId);
	if (tmpChampionship) {
		aChampionship = {
			id: tmpChampionship.data.id,
			name: tmpChampionship.data.name,
			description: tmpChampionship.data.description,
			season: tmpChampionship.data.season,
			location: tmpChampionship.data.location,
			competitionsId: tmpChampionship.data.competitionsId,
			individualScale: tmpChampionship.data.individualScale.id,
			collectiveScale: tmpChampionship.data.collectiveScale.id,
			rankingClubs: tmpChampionship.data.rankingClubs,
			rankingPlayers: tmpChampionship.data.rankingPlayers,
			status: tmpChampionship.data.status,
			maxScoringTeams: tmpChampionship.data.maxScoringTeams,
			managersId: tmpChampionship.data.managersId,
			cpManagersId: tmpChampionship.data.cpManagersId,
			supervisorsId: tmpChampionship.data.supervisorsId
		};
		const aIdvScale: MarkedPointScale | undefined = tmpChampionship.data.individualScale;
		const aClvScale: MarkedPointScale | undefined = tmpChampionship.data.collectiveScale;

		if (aIdvScale) {
			mpsStore.remove(aIdvScale.id);
			mpsStore.load(aIdvScale);
		}
		if (aClvScale) {
			mpsStore.remove(aClvScale.id);
			mpsStore.load(aClvScale);
		}
		if (aChampionship) {
			championshipStore.remove(aChampionship.id);
			championshipStore.load(aChampionship);

			if (userId !== '' && userRole === 'marshall')
				await cloudLoadCurrentCompetitionForSupervisor(aChampionship.id, userId);
			else await cloudLoadCompetitionsChampionship(aChampionship.id);
			await cloudLoadChampionshipsClubs(aChampionship.id);
		}
	}

	messageStore.reset();
	return aChampionship;
};

export const calculateChampionship = (aChampionship: Championship) => {
	let rankingClv: Ranking[] = [];
	let rankingIdv: Ranking[] = [];
	const idvScale: MarkedPointScale | undefined = mpsStore.getScaleById(
		aChampionship.individualScale
	);
	const clvScale: MarkedPointScale | undefined = mpsStore.getScaleById(
		aChampionship.collectiveScale
	);

	aChampionship.competitionsId.forEach((cId: string) => {
		const competition = competitionsStore.find(cId);
		if (competition && (competition.status === 'finished' || competition.status === 'published')) {
			let course: Course | undefined;
			let targets: Target[] = [];
			let regulations: Regulations | undefined;
			let regulation: Regulation | undefined;
			if (competition.courseId !== '') course = coursesChampionshipStore.find(competition.courseId);
			if (course) targets = course.targets;
			if (competition.regulationsId) regulations = regulationsStore.find(competition.regulationsId);
			if (regulations) regulation = regulations.regulation;

			// Calcul pour le classement individuel
			if (idvScale && regulation && !regulation.teamGame) {
				rankingIdv = rankingForIndividualCompetition(competition, targets, idvScale, rankingIdv);
			}

			// Calcul pour le classement des clubs si compétition en équipe
			if (clvScale && isCompetitionTeam(competition)) {
				rankingClv = rankingForCollectiveCompetition(
					competition,
					targets,
					clvScale,
					rankingClv,
					aChampionship.maxScoringTeams,
					regulation
				);
			}

			// Calcul pour le classement des clubs si compétition solo et calcul résultat équipe
			if (clvScale && !regulation?.teamGame && regulations?.doubleRanking) {
				rankingClv = rankingClubForIdvCompetition(
					competition,
					targets,
					clvScale,
					rankingClv,
					regulations,
					regulation || ({} as Regulation)
				);
			}
		}
	});
	aChampionship.rankingPlayers = smartSort(rankingIdv, 'score', false);
	aChampionship.rankingClubs = smartSort(rankingClv, 'score', false);
};

export const rankingClubForIdvCompetition = (
	aCompetition: Competition,
	targets: Target[],
	aScale: MarkedPointScale,
	curClvRank: Ranking[],
	regulations: Regulations,
	regulation: Regulation
): Ranking[] => {
	let teams = teamsForDoubleRanking(aCompetition, targets, regulations);
	// Ne conserver que les équipes dont le club est affilié à la fédération
	teams = teams.filter((t) => t.clubId !== '' && clubsStore.find(t.clubId)?.isMember);

	const players = playersChampionshipStore.list.filter((p) =>
		teams.flatMap((t) => t.playersId).includes(p.id)
	);
	if (!targets || !teams || !players || !regulation) return curClvRank;

	const rankedTeams = getRankedTeams(teams, targets, players, regulation);

	for (let i = 0; i < rankedTeams.length; i++) {
		let prevScore: number = 0;
		let prevCompetitions: string[] = [];
		const pId = curClvRank.findIndex((rp: Ranking) => rp.id === rankedTeams[i].team.clubId);
		if (pId !== -1) {
			prevScore = curClvRank[pId].score;
			prevCompetitions = curClvRank[pId].competitionsId;
			curClvRank = curClvRank.filter((rc) => rc.id !== rankedTeams[i].team.clubId);
		}
		curClvRank.push({
			id: rankedTeams[i].team.clubId || '',
			score: aScale.points[i] + prevScore,
			competitionsId: [...prevCompetitions, aCompetition.id]
		});
	}
	return curClvRank;
};

export const rankingForCollectiveCompetition = (
	aCompetition: Competition,
	targets: Target[],
	aScale: MarkedPointScale,
	curClvRank: Ranking[],
	nbMaxScoringTeams: number,
	regulation: Regulation | undefined
): Ranking[] => {
	if (!targets || !regulation || !aScale) return curClvRank;

	let teams = teamsCompetitionStore.list.filter(
		(t) => aCompetition.teamsId.includes(t.id) && t.clubId !== ''
	);
	// Ne conserver que les équipes dont le club est affilié à la fédération
	teams = teams.filter((t) => t.clubId !== '' && clubsStore.find(t.clubId)?.isMember);

	const players = playersChampionshipStore.list.filter((p) =>
		teams.flatMap((t) => t.playersId).includes(p.id)
	);
	const INITIAL_COUNT = 1;

	if (!teams || !players) return curClvRank;
	let rankedTeams: RankedTeam[] = [];
	let clubsRecord: Record<string, number> = {};

	if (targets && teams && players && regulation)
		rankedTeams = getRankedTeams(teams, targets, players, regulation);

	for (let i = 0; i < rankedTeams.length; i++) {
		if (!clubsRecord[rankedTeams[i].team.clubId])
			clubsRecord[rankedTeams[i].team.clubId] = INITIAL_COUNT;
		else clubsRecord[rankedTeams[i].team.clubId]++;
		if (clubsRecord[rankedTeams[i].team.clubId] > nbMaxScoringTeams) continue;

		let prevScore: number = 0;
		let prevCompetitions: string[] = [];
		// Recherche du club dans rankingTeams
		// Todo : gérer les égalités
		const pId = curClvRank.findIndex((rp: Ranking) => rp.id === rankedTeams[i].team.clubId);
		if (pId !== -1) {
			prevScore = curClvRank[pId].score;
			prevCompetitions = curClvRank[pId].competitionsId;
			curClvRank = curClvRank.filter((rc) => rc.id !== rankedTeams[i].team.clubId);
		}
		curClvRank.push({
			id: rankedTeams[i].team.clubId || '',
			score: aScale.points[i] + prevScore,
			competitionsId: [...prevCompetitions, aCompetition.id]
		});
	}

	return curClvRank;
};

export const rankingForIndividualCompetition = (
	aCompetition: Competition,
	targets: Target[],
	aScale: MarkedPointScale,
	curIdvRank: Ranking[]
): Ranking[] => {
	let players = playersChampionshipStore.list.filter(
		(p) => aCompetition.playersId.includes(p.id) && p.clubId !== ''
	);
	// Ne conserver que les équipes dont le club est affilié à la fédération
	players = players.filter((p) => p.clubId !== '' && clubsStore.find(p.clubId || '')?.isMember);

	// Récupérer le score validé de chaque joueur lors de la compétition
	players.forEach((p) => {
		p.scores = resultsCompetitionStore.find(aCompetition.id, p.id)?.scores ?? {};
	});

	const rankedPlayers: RankedPlayer[] =
		targets && players ? getRankedPlayers(players, targets) : [];

	for (let i = 0; i < rankedPlayers.length; i++) {
		let prevScore: number = 0;
		let prevCompetitions: string[] = [];
		// Recherche du joueur dans rankingPlayers
		// Todo : gérer les égalités ...
		const pId = curIdvRank.findIndex((rp: Ranking) => rp.id === rankedPlayers[i].player.id);
		if (pId !== -1) {
			prevScore = curIdvRank[pId].score;
			prevCompetitions = curIdvRank[pId].competitionsId;
			curIdvRank.splice(pId, 1);
			curIdvRank = curIdvRank.filter((rp) => rp.id !== rankedPlayers[i].player.clubId);
		}
		curIdvRank.push({
			id: rankedPlayers[i].player.id,
			score: aScale.points[i] + prevScore,
			competitionsId: [...prevCompetitions, aCompetition.id]
		});
	}
	return curIdvRank;
};
