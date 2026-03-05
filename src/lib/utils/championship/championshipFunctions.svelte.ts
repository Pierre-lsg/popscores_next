import { championshipStore } from '$lib/stores/championship/championshipsStore.svelte';
import { mpsStore } from '$lib/stores/championship/markedPointScaleStore.svelte';
import { playersChampionshipStore } from '$lib/stores/championship/playersChampionshipStore.svelte';
import { competitionsStore } from '$lib/stores/championship/competitionsStore.svelte';
import { coursesChampionshipStore } from '$lib/stores/championship/coursesChampionshipStore.svelte';
import { regulationsStore } from '$lib/stores/championship/regulationsStore.svelte';
import { teamsChampionshipStore } from '$lib/stores/championship/teamsChampionshipStore.svelte';
import { resultsCompetitionStore } from '$lib/stores/championship/resultsCompetitionStore.svelte';

import { teamsForDoubleRanking } from './competitionsFunctions.svelte';
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
import type { Player } from '$lib/types/playerType';
import type { RankedPlayer } from '$lib/types/playerType';
import type { RankedTeam } from '$lib/types/teamType';
import type { Competition } from '$lib/types/competitionType';

export const getSupervisors = async () => {
	let supervisors: User[] = [];
	let users: any = await userService.getByRole('marshall');

	if (Array.isArray(users)) {
		users.forEach((u) =>
			supervisors.push({
				id: u.id,
				email: '',
				emailVisibility: false,
				verified: true,
				name: u.name,
				roles: []
			})
		);
	}

	return supervisors;
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
		let course: Course | undefined;
		let targets: Target[] = [];
		let regulations: Regulations | undefined;
		let regulation: Regulation | undefined;
		if (competition && competition.courseId !== '')
			course = coursesChampionshipStore.find(competition.courseId);
		if (course) targets = course.targets;
		if (competition && competition.regulationsId)
			regulations = regulationsStore.find(competition.regulationsId);
		if (regulations) regulation = regulations.regulation;

		// Calcul pour le classement individuel
		if (competition && idvScale && regulation && !regulation.teamGame) {
			rankingIdv = rankingForIndividualCompetition(competition, targets, idvScale, rankingIdv);
		}

		// Calcul pour le classement des clubs si compétition en équipe
		if (competition && clvScale && isCompetitionTeam(competition)) {
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
		if (competition && clvScale && !isCompetitionTeam(competition) && regulations?.doubleRanking) {
			rankingClv = rankingClubForIdvCompetition(
				competition,
				targets,
				clvScale,
				rankingClv,
				regulations,
				regulation || ({} as Regulation)
			);
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
	let players: Player[] | undefined = playersChampionshipStore.list.filter((p) =>
		teams
			.map((t) => t.playersId)
			.flat()
			.includes(p.id)
	);
	let rankedTeams: RankedTeam[] = [];
	if (targets && teams && players && regulation)
		rankedTeams = getRankedTeams(teams, targets, players, regulation);
	for (let i = 0; i < rankedTeams.length; i++) {
		let prevScore: number = 0;
		let prevCompetitions: string[] = [];
		const pId = curClvRank.findIndex((rp: Ranking) => rp.id === rankedTeams[i].team.clubId);
		if (pId !== -1) {
			prevScore = curClvRank[pId].score;
			prevCompetitions = curClvRank[pId].competitionsId;
			curClvRank.splice(pId, 1);
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
	let teams = teamsChampionshipStore.list.filter((t) => aCompetition.teamsId.includes(t.id));
	let players: Player[] | undefined = playersChampionshipStore.list.filter((p) =>
		teams
			.map((t) => t.playersId)
			.flat()
			.includes(p.id)
	);
	let rankedTeams: RankedTeam[] = [];
	let clubsRecord: Record<string, number> = {};

	if (targets && teams && players && regulation)
		rankedTeams = getRankedTeams(teams, targets, players, regulation);

	for (let i = 0; i < rankedTeams.length; i++) {
		if (!clubsRecord[rankedTeams[i].team.clubId]) clubsRecord[rankedTeams[i].team.clubId] = 1;
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
			curClvRank.splice(pId, 1);
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
	let players = playersChampionshipStore.list.filter((p) => aCompetition.playersId.includes(p.id));
	let rankedPlayers: RankedPlayer[] = [];
	// Récupérer le score validé de chaque joueur lors de la compétition
	players.forEach((p) => {
		p.scores = resultsCompetitionStore.find(aCompetition.id, p.id)?.scores ?? {};
	});
	if (targets && players) rankedPlayers = getRankedPlayers(players, targets);

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
		}
		curIdvRank.push({
			id: rankedPlayers[i].player.id,
			score: aScale.points[i] + prevScore,
			competitionsId: [...prevCompetitions, aCompetition.id]
		});
	}
	return curIdvRank;
};
