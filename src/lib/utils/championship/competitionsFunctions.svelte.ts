import type { Competition } from '$lib/types/competitionType';
import type { Course } from '$lib/types/courseType';
import type { Player, RankedPlayer } from '$lib/types/playerType';
import type { Regulations, Regulation } from '$lib/types/regulationsType';
import type { RankedTeam, Team } from '$lib/types/teamType';
import type { Fly } from '$lib/types/flyType';
import type { Club } from '$lib/types/clubType';
import type { Championship } from '$lib/types/championshipType';

import { regulationsStore } from '$lib/stores/championship/regulationsStore.svelte';
import { teamsChampionshipStore } from '$lib/stores/championship/teamsChampionshipStore.svelte';
import { teamsCompetitionStore } from '$lib/stores/championship/teamsCompetitionStore.svelte';
import { playersChampionshipStore } from '$lib/stores/championship/playersChampionshipStore.svelte';
import { coursesChampionshipStore } from '$lib/stores/championship/coursesChampionshipStore.svelte';
import { targetsChampionshipStore } from '$lib/stores/championship/targetsChampionshipStore.svelte';
import { flysChampionshipStore } from '$lib/stores/championship/flysChampionshipStore.svelte';
import { competitionsStore } from '$lib/stores/championship/competitionsStore.svelte';
import { clubsStore } from '$lib/stores/championship/clubsStore.svelte';
import { messageStore } from '$lib/stores/appEventStore.svelte';
import { resultsCompetitionStore } from '$lib/stores/championship/resultsCompetitionStore.svelte';
import { calculatePlayerScore } from '../session/golfScoringFunction.svelte';

import { toastStore } from '$lib/stores/toastStore.svelte';
import { teamService } from '../pocketbase/teams2Cloud';
import { playerService } from '../pocketbase/players2Cloud';
import { courseService } from '../pocketbase/courses2Cloud';
import { targetService } from '../pocketbase/target2Cloud';
import { regulationService } from '../pocketbase/regulations2Cloud ';
import { competitionService } from '../pocketbase/competitions2Cloud';
import { flyService } from '../pocketbase/flys2Cloud';
import { clubService } from '../pocketbase/clubs2Cloud';
import { resultService } from '../pocketbase/Result2Cloud';
import type { Result } from '$lib/types/resultType';
import type { Target } from '$lib/types/targetType';
import { scoreCardService } from '../pocketbase/scoreCards2Cloud';
import type { ScoreCard } from '$lib/types/scoreCardType';

export const isCompetitionTeam = (competition: Competition) => {
	let rules: Regulations | undefined;
	let isTeamGame: boolean = false;
	if (competition) {
		if (competition.regulationsId !== '') {
			rules = regulationsStore.find(competition.regulationsId || '');
		}
		if (rules) {
			isTeamGame = rules.regulation.teamGame;
		}
	}
	return isTeamGame;
};

export const getRules = (competition: Competition): Regulations => {
	let rules: Regulations = {} as Regulations;
	let tmpRegulations: Regulations | undefined;
	if (competition) {
		if (competition.regulationsId !== '')
			tmpRegulations = regulationsStore.find(competition.regulationsId);
		if (!tmpRegulations) {
			tmpRegulations = regulationsStore.new();
			competition.regulationsId = tmpRegulations.id;
		}
		rules = tmpRegulations;
	}
	return rules;
};

export const getFilteredPlayers = (
	allPlayers: Player[],
	clubFilt: string,
	playerFilt: String
): Player[] => {
	let tempFilteredList: Player[] = allPlayers;

	if (clubFilt !== '') {
		tempFilteredList = tempFilteredList.filter((player) => player.clubId === clubFilt);
	}

	if (playerFilt !== '') {
		tempFilteredList = tempFilteredList.filter((player) =>
			player.name.toLowerCase().includes(playerFilt.toLowerCase())
		);
	}

	return tempFilteredList;
};

export const getFilteredTeams = (allTeams: Team[], clubFilt: string, teamFilt: String): Team[] => {
	let tempFilteredList: Team[] = allTeams;

	if (clubFilt !== '') {
		tempFilteredList = tempFilteredList.filter((team) => team.clubId === clubFilt);
	}

	if (teamFilt !== '') {
		tempFilteredList = tempFilteredList.filter((team) =>
			team.name.toLowerCase().includes(teamFilt.toLowerCase())
		);
	}

	return tempFilteredList;
};

export const cloudSaveAllCompetition = async (
	competition: Competition,
	csId: string
): Promise<string> => {
	let status: string = 'success';

	status = await cloudSaveCompetition(competition, csId);
	messageStore.remove('modifComp');

	// Lister et sauver les clubs dont les joueurs ou équipes participeraient
	status = await cloudSaveClubs(competition.clubsId);
	messageStore.remove('modifClubs');

	// Lister et sauver les équipes
	status = await cloudSaveTeams(competition.teamsId);
	messageStore.remove('modifTeams');

	// Lister et sauver les joueurs
	status = await cloudSavePlayers(competition.playersId);
	messageStore.remove('modifPlayer');

	// Lister et sauver les flys
	status = await cloudSaveFlys(competition.flysId);
	messageStore.remove('modifFly');

	// Sauver le règlement associé s'il existe
	status = await cloudSaveRegulations(competition.regulationsId);
	messageStore.remove('modifRegul');

	// Sauver le parcours associé et ses cibles s'il existe
	status = await cloudSaveCourseAndTargets(competition.courseId);
	messageStore.remove('modifCourse');

	// Sauver les résultats de la compétition
	status = await cloudSaveResults(competition.id);
	messageStore.remove('modifResult');

	return status;
};

export const cloudSaveCompetition = async (
	competition: Competition,
	csId: string
): Promise<string> => {
	let status: string = 'success';

	// sauver la compétition
	try {
		competitionService.saveCompetition(competition, csId);
	} catch (e) {
		console.log('error', e);
		status = 'failure';
	}
	return status;
};

export const cloudSaveClubs = async (clubsId: string[]): Promise<string> => {
	let status: string = 'success';

	for (const clubId of clubsId) {
		const aClub: Club | undefined = clubsStore.find(clubId);
		if (aClub) {
			try {
				clubService.saveClub(aClub);
			} catch (e) {
				console.log('error', e);
				status = 'failure';
			}
		}
	}
	return status;
};

export const cloudSaveTeams = async (teamsId: string[]): Promise<string> => {
	let status: string = 'success';

	for (const teamId of teamsId) {
		const aTeam: Team | undefined = teamsChampionshipStore.find(teamId);
		if (aTeam) {
			try {
				teamService.saveTeam(aTeam);
			} catch (e) {
				console.log('error', e);
				status = 'failure';
			}
		}
	}
	return status;
};

export const cloudSavePlayers = async (playersId: string[]): Promise<string> => {
	let status: string = 'success';

	for (const playerId of playersId) {
		const aPlayer: Player | undefined = playersChampionshipStore.find(playerId);
		if (aPlayer) {
			try {
				playerService.savePlayer(aPlayer);
			} catch (e) {
				console.log('error', e);
				status = 'failure';
			}
		}
	}
	return status;
};

export const cloudSaveFlys = async (flysId: string[]): Promise<string> => {
	let status: string = 'success';

	for (const flyId of flysId) {
		const aFly: Fly | undefined = flysChampionshipStore.find(flyId);
		if (aFly) {
			try {
				flyService.saveFly(aFly);
			} catch (e) {
				console.log('error', e);
				status = 'failure';
			}
		}
	}
	return status;
};

export const cloudSaveRegulations = async (regulationsId: string): Promise<string> => {
	let status: string = 'success';

	if (regulationsId !== '') {
		const aRegulation: Regulations | undefined = regulationsStore.find(regulationsId);
		if (aRegulation) {
			try {
				regulationService.saveRegulation(aRegulation);
			} catch (e) {
				console.log('error', e);
				status = 'failure';
			}
		}
	}
	return status;
};

export const cloudSaveCourseAndTargets = async (courseId: string): Promise<string> => {
	let status: string = 'success';

	if (courseId !== '') {
		const aCourse: Course | undefined = coursesChampionshipStore.find(courseId);
		if (aCourse) {
			try {
				courseService.saveCourse(aCourse);
			} catch (e) {
				console.log('error', e);
				status = 'failure';
			}

			// Et les cibles liées au parcours
			try {
				targetService.saveTargets(aCourse.targets);
			} catch (e) {
				console.log('error', e);
				status = 'failure';
			}
		}
	}
	return status;
};

export const cloudSaveResults = async (competitionId: string): Promise<string> => {
	let status: string = 'success';

	const results = resultsCompetitionStore.list.filter(
		(result) => result.competitionId === competitionId
	);
	if (results) {
		try {
			resultService.saveResults(results);
		} catch (e) {
			console.log('error', e);
			status = 'failure';
		}
	}
	return status;
};

export const cloudLoadCompetitionsChampionship = async (csId: string): Promise<string> => {
	let status: string = 'success';

	// Charger l'ensemble des compétitions
	let tmpCompetitions = await competitionService.getCompetitionsByChampionship(csId);

	for (const aCompetition of tmpCompetitions) {
		competitionsStore.remove(aCompetition.id);
		competitionsStore.load(aCompetition);

		// Charger le règlement
		if (aCompetition.regulationsId && aCompetition.regulationsId !== '') {
			cloudLoadRegulations(aCompetition.regulationsId);
		}

		// Charger le parcours
		if (aCompetition.courseId && aCompetition.courseId !== '') {
			cloudLoadCourse(aCompetition.courseId);
		}

		// Charger les clubs liés à la compétition
		cloudLoadClubs(aCompetition.clubsId);

		// Charger les équipes liés à la compétition
		if (isCompetitionTeam(aCompetition)) cloudLoadTeams(aCompetition.teamsId, aCompetition.id);
		else cloudLoadPlayersCompetition(aCompetition.playersId, aCompetition.id);

		// Charger les flys
		cloudLoadFlys(aCompetition.flysId);
	}

	return status;
};

export const cloudLoadCurrentCompetitionForSupervisor = async (
	csId: string,
	userId: string
): Promise<string> => {
	let status: string = 'success';

	// Charger la compétition
	// Todo : tests en amont pour savoir s'il est nécessaire de charger
	let tmpCompetitions = await competitionService.getCompetitionsByChampionship(csId);
	const today = new Date().toISOString().slice(0, 10);
	tmpCompetitions = tmpCompetitions.filter((t) => t.startDate === today);

	for (const aCompetition of tmpCompetitions) {
		competitionsStore.remove(aCompetition.id);
		competitionsStore.load(aCompetition);

		// Charger le règlement
		if (aCompetition.regulationsId && aCompetition.regulationsId !== '') {
			cloudLoadRegulations(aCompetition.regulationsId);
		}

		// Charger le parcours
		if (aCompetition.courseId && aCompetition.courseId !== '') {
			cloudLoadCourse(aCompetition.courseId);
		}

		// Charger les flys du superviseur
		for (let flyId of aCompetition.flysId) {
			let aFly = await flyService.getFlyById(flyId);
			if (aFly && aFly.supervisorId === userId) {
				flysChampionshipStore.remove(aFly.id);
				flysChampionshipStore.load(aFly);

				// Charger les clubs liés à la compétition
				cloudLoadClubs(aCompetition.clubsId);

				// Charger les équipes liés à la compétition
				if (isCompetitionTeam(aCompetition)) {
					cloudLoadTeams(aFly.teamsId, aCompetition.id);
				} else {
					cloudLoadPlayersCompetition(aFly.playersId, aCompetition.id);
				}
			}
		}
	}

	return status;
};

export const cloudLoadCompetition = async (cId: string): Promise<string> => {
	let status: string = 'success';

	// Charger la compétition
	let aCompetition = await competitionService.getCompetitionById(cId);

	if (aCompetition) {
		competitionsStore.remove(aCompetition.id);
		competitionsStore.load(aCompetition);

		// Charger le règlement
		if (aCompetition.regulationsId && aCompetition.regulationsId !== '') {
			cloudLoadRegulations(aCompetition.regulationsId);
		}

		// Charger le parcours
		if (aCompetition.courseId && aCompetition.courseId !== '') {
			cloudLoadCourse(aCompetition.courseId);
		}

		// Charger les flys du superviseur
		for (let flyId of aCompetition.flysId) {
			let aFly = await flyService.getFlyById(flyId);
			if (aFly) {
				flysChampionshipStore.remove(aFly.id);
				flysChampionshipStore.load(aFly);

				// Charger les clubs liés à la compétition
				cloudLoadClubs(aCompetition.clubsId);

				// Charger les équipes liés à la compétition
				if (isCompetitionTeam(aCompetition)) {
					cloudLoadTeams(aFly.teamsId, aCompetition.id);
				} else {
					cloudLoadPlayersCompetition(aFly.playersId, aCompetition.id);
				}
			}
		}
	}

	return status;
};

export const cloudLoadRegulations = async (regulationsId: string) => {
	const aRegulation = await regulationService.getRegulationById(regulationsId);
	if (aRegulation) {
		regulationsStore.remove(aRegulation.id);
		regulationsStore.load(aRegulation);
	}
};

export const cloudLoadCourse = async (courseId: string) => {
	const aCourse = await courseService.getCourseById(courseId);
	if (aCourse) {
		coursesChampionshipStore.remove(aCourse.id);
		coursesChampionshipStore.load(aCourse);

		// Charger les cibles du parcours
		for (let aTarget of aCourse.targets) {
			targetsChampionshipStore.remove(aTarget.id);
			targetsChampionshipStore.load(aTarget);
		}
	}
};

export const cloudLoadClubs = async (clubsId: string[]) => {
	for (let clubId of clubsId) {
		const aClub = await clubService.getClubById(clubId);
		if (aClub) {
			clubsStore.remove(aClub.id);
			clubsStore.load(aClub);
		}
	}
};

export const cloudLoadPlayersCompetition = async (playersId: string[], competitionId: string) => {
	for (let playerId of playersId) {
		const aPlayer = await playerService.getPlayerById(playerId);
		if (aPlayer) {
			playersChampionshipStore.remove(aPlayer.id);
			playersChampionshipStore.load(aPlayer);
		}

		// Charger les résultats enregistrés
		cloudLoadResults(aPlayer.id, competitionId);
	}
};

export const cloudLoadResults = async (playerId: string, competitionId: string) => {
	const results: Result[] = await resultService.getResultsByCompetitionAndPlayer(
		competitionId,
		playerId
	);
	for (let aResult of results) {
		resultsCompetitionStore.remove(aResult.competitionId, aResult.playerId);
		resultsCompetitionStore.load(aResult);
	}
};

export const cloudLoadTeams = async (teamsId: string[], competitionId: string) => {
	for (let teamId of teamsId) {
		const aTeam = await teamService.getTeamById(teamId);
		if (aTeam) {
			teamsChampionshipStore.remove(aTeam.id);
			teamsChampionshipStore.load(aTeam);
		}

		cloudLoadPlayersCompetition(aTeam.playersId, competitionId);
	}
};

export const cloudLoadFlys = async (flysId: string[]) => {
	for (let flyId of flysId) {
		let aFly = await flyService.getFlyById(flyId);
		if (aFly) {
			flysChampionshipStore.remove(aFly.id);
			flysChampionshipStore.load(aFly);
		}
	}
};

export const cloudSaveScoreCard = async (
	competition: Competition,
	fly: Fly,
	rankedTeams: RankedTeam[],
	rankedPlayers: RankedPlayer[],
	targets: Target[],
	players: Player[],
	regulation: Regulation
): Promise<string> => {
	let status: string = 'success';

	const aScoreCard = {
		competition: competition,
		fly: fly,
		rankedTeams: rankedTeams,
		rankedPlayers: rankedPlayers,
		targets: targets,
		players: players,
		regulation: regulation
	};

	if (aScoreCard) {
		try {
			scoreCardService.saveScoreCard(aScoreCard);
		} catch (e) {
			console.log('error', e);
			status = 'failure';
		}
	}

	return status;
};

export const cloudLoadCompetitionScoreCards = async (
	competitionId: string
): Promise<ScoreCard[]> => {
	const scoreCards = scoreCardService.getScoreCardByCompetition(competitionId);

	return scoreCards;
};

export const teamsForDoubleRanking = (
	competition: Competition,
	targets: Target[],
	rules: Regulations
): Team[] => {
	let teams: Team[] = [];

	for (const clubId of competition.clubsId) {
		let clubName: string = '';
		if (clubId && clubId != '') {
			clubName = clubsStore.find(clubId)?.name || 'vide';
			// Retrouver l'ensemble des joueurs de ce club qui ont participé à la compétition
			let playersClubCompetition = playersChampionshipStore.list
				.filter((p) => p.clubId === clubId)
				.filter((p) => competition.playersId.includes(p.id));
			// Trier cette liste par résultat à la compétition
			playersClubCompetition.sort((a, b) => {
				return calculatePlayerScore(a, targets) - calculatePlayerScore(b, targets);
			});
			// Si suffisament de compétiteurs pour former une équipe
			if (playersClubCompetition.length >= rules.nbPlayersForDoubleRankingTeam) {
				// Créer une équipe avec les meilleurs compétiteurs
				let team: Team = { id: '', name: clubName, playersId: [], clubId: clubId };
				for (let i = 0; i < rules.nbPlayersForDoubleRankingTeam; i++) {
					team.playersId.push(playersClubCompetition[i].id);
				}
				teams.push(team);
			}
		}
	}
	return teams;
};

export const startCompetition = async (
	currentCompetition: Competition,
	championship: Championship
) => {
	if (confirm('Voulez-vous figer les flys et démarrer la compétition ?')) {
		//Figer les équipes de la compétition
		currentCompetition.teamsId.forEach((teamId: string) => {
			const aTeam = teamsChampionshipStore.find(teamId);
			if (aTeam) {
				aTeam.sessionId = currentCompetition.id;
				teamsCompetitionStore.findByIdAndSession(aTeam.id, aTeam.sessionId || '');
				teamsCompetitionStore.load(aTeam);
			}
		});
		//teamsCompetitionStore.find

		let status = await cloudSaveAllCompetition(currentCompetition, championship.id);
		currentCompetition.status = 'in_progress';
		currentCompetition.step = 'welcome';

		// mettre à jour dans le Cloud la compétition et ses éléments dans le Cloud
		switch (status) {
			case 'success':
				toastStore.show('💾 Compétition mise à jour ...', 'success');
				break;
			case 'failure':
				toastStore.show("💾 Echec à l'enregistrement ...", 'failure');
				break;
			default:
				toastStore.show('💾 Enregsistrement en cours ...', 'failure');
		}
	}
};
