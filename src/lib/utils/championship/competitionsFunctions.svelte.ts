import type { Competition } from '$lib/types/competitionType';
import type { Course } from '$lib/types/courseType';
import type { Player } from '$lib/types/playerType';
import type { Regulations } from '$lib/types/regulationsType';
import type { Team } from '$lib/types/teamType';
import type { Fly } from '$lib/types/flyType';
import type { Club } from '$lib/types/clubType';

import { regulationsStore } from '$lib/stores/championship/regulationsStore.svelte';
import { teamsChampionshipStore } from '$lib/stores/championship/teamsChampionshipStore.svelte';
import { playersChampionshipStore } from '$lib/stores/championship/playersChampionshipStore.svelte';
import { coursesChampionshipStore } from '$lib/stores/championship/coursesChampionshipStore.svelte';
import { targetsChampionshipStore } from '$lib/stores/championship/targetsChampionshipStore.svelte';
import { flysChampionshipStore } from '$lib/stores/championship/flysChampionshipStore.svelte';
import { competitionsStore } from '$lib/stores/championship/competitionsStore.svelte';
import { clubsStore } from '$lib/stores/championship/clubsStore.svelte';
import { resultsCompetitionStore } from '$lib/stores/championship/resultsCompetitionStore.svelte';

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

export const cloudSaveCompetition = async (
	competition: Competition,
	csId: string
): Promise<string> => {
	let status: string = 'success';

	// Lister et sauver les clubs dont les joueurs ou équipes participeraient
	for (const clubId of competition.clubsId) {
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

	// Lister et sauver les équipes
	for (const teamId of competition.teamsId) {
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

	// Lister et sauver les joueurs
	for (const playerId of competition.playersId) {
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

	// Lister et sauver les flys
	for (const flyId of competition.flysId) {
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

	// Sauver le règlement associé s'il existe
	if (competition.regulationsId && competition.regulationsId !== '') {
		const aRegulation: Regulations | undefined = regulationsStore.find(competition.regulationsId);
		if (aRegulation) {
			try {
				regulationService.saveRegulation(aRegulation);
			} catch (e) {
				console.log('error', e);
				status = 'failure';
			}
		}
	}

	// Sauver le parcours associé s'il existe
	if (competition.courseId && competition.courseId !== '') {
		const aCourse: Course | undefined = coursesChampionshipStore.find(competition.courseId);
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

		// Sauver les résultats de la compétition
		const results = resultsCompetitionStore.list.filter(
			(result) => result.competitionId === competition.id
		);
		if (results) {
			try {
				resultService.saveResults(results);
			} catch (e) {
				console.log('error', e);
				status = 'failure';
			}
		}
	}

	// sauver la compétition
	try {
		competitionService.saveCompetition(competition, csId);
	} catch (e) {
		console.log('error', e);
		status = 'failure';
	}

	return status;
};

export const cloudLoadCurrentCompetition = async (csId: string): Promise<string> => {
	let status: string = 'success';

	console.log('championship', csId);
	// Charger la compétition
	// Pour l'instant toutes les compétitions mais todo restreindre à la seule en cours
	const tmpCompetitions = await competitionService.getCompetitionsByChampionship(csId);
	console.log('tmpCompetitions', tmpCompetitions);
	for (const aCompetition of tmpCompetitions) {
		// Todo : si version plus récente
		competitionsStore.remove(aCompetition.id);
		competitionsStore.load(aCompetition);

		// Charger les clubs liés à la compétition
		for (let clubId of aCompetition.clubsId) {
			const aClub = await clubService.getClubById(clubId);
			if (aClub) {
				clubsStore.remove(aClub.id);
				clubsStore.load(aClub);
			}
		}

		// Charger les équipes liés à la compétition
		for (let teamId of aCompetition.teamsId) {
			const aTeam = await teamService.getTeamById(teamId);
			if (aTeam) {
				teamsChampionshipStore.remove(aTeam.id);
				teamsChampionshipStore.load(aTeam);
			}
		}

		// Charger les joueurs liés à la compétition
		for (let playerId of aCompetition.playersId) {
			const aPlayer = await playerService.getPlayerById(playerId);
			if (aPlayer) {
				playersChampionshipStore.remove(aPlayer.id);
				playersChampionshipStore.load(aPlayer);
			}
		}

		// Charger les flys
		for (let flyId of aCompetition.flysId) {
			const aFly = await flyService.getFlyById(flyId);
			if (aFly) {
				flysChampionshipStore.remove(aFly.id);
				flysChampionshipStore.load(aFly);
			}
		}

		// Charger le règlement
		if (aCompetition.regulationsId && aCompetition.regulationsId !== '') {
			const aRegulation = await regulationService.getRegulationById(aCompetition.regulationsId);
			if (aRegulation) {
				regulationsStore.remove(aRegulation.id);
				regulationsStore.load(aRegulation);
			}
		}

		// Charger le parcours
		if (aCompetition.courseId && aCompetition.courseId !== '') {
			const aCourse = await courseService.getCourseById(aCompetition.courseId);
			if (aCourse) {
				coursesChampionshipStore.remove(aCourse.id);
				coursesChampionshipStore.load(aCourse);

				// Charger les cibles du parcours
				for (let aTarget of aCourse.targets) {
					targetsChampionshipStore.remove(aTarget.id);
					targetsChampionshipStore.load(aTarget);
				}
			}
		}

		// Charger les résultats enregistrés
		const results: Result[] = await resultService.getResultsByCompetition(aCompetition.id);
		for (let aResult of results) {
			resultsCompetitionStore.remove(aResult.competitionId, aResult.playerId);
			resultsCompetitionStore.load(aResult);
		}
	}

	return status;
};
