import type { Club } from '$lib/types/clubType';
import type { Team } from '$lib/types/teamType';
import type { Player } from '$lib/types/playerType';

import { teamsChampionshipStore } from '$lib/stores/championship/teamsChampionshipStore.svelte';
import { playersChampionshipStore } from '$lib/stores/championship/playersChampionshipStore.svelte';
import { clubsStore } from '$lib/stores/championship/clubsStore.svelte';

import { teamService } from '../pocketbase/teams2Cloud';
import { playerService } from '../pocketbase/players2Cloud';
import { clubService } from '../pocketbase/clubs2Cloud';

export const cloudSaveClubs = async (clubs: Club[]): Promise<string> => {
	let status: string = 'success';

	for (let club of clubs) {
		// sauver le club
		await clubService.saveClub(club);

		// Lister et sauver les équipes
		for (let teamId of club.teamsId) {
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
		for (let playerId of club.playersId) {
			const aPlayer: Player | undefined = playersChampionshipStore.find(playerId);
			console.log(aPlayer);
			if (aPlayer) {
				try {
					playerService.savePlayer(aPlayer);
				} catch (e) {
					console.log('error', e);
					status = 'failure';
				}
			}
		}
	}

	return status;
};

export const cloudLoadClubs = async (clubs: Club[]): Promise<string> => {
	let status: string = 'success';

	for (let club of clubs) {
		// Récupérer dans le cloud les équipes et les charger dans le modèle local
		const teams: Team[] = await teamService.getTeamsByClub(club.id);
		for (const team of teams) {
			teamsChampionshipStore.remove(team.id);
			teamsChampionshipStore.load(team);
		}

		// Récupérer dans le cloud les joueurs et les charger dans le modèle local
		const players: Player[] = await playerService.getPlayersByClub(club.id);
		for (const player of players) {
			playersChampionshipStore.remove(player.id);
			playersChampionshipStore.load(player);
		}

		// sauver le club
		clubsStore.load(club);
	}

	return status;
};

export const cloudLoadChampionshipsClubs = async (csId: string): Promise<string> => {
	const allClubs = await clubService.getAllClubsOfChampionship(csId);

	for (let club of allClubs) {
		// sauver le club
		clubsStore.remove(club.id);
		clubsStore.load(club);

		// Récupérer dans le cloud les équipes et les charger dans le modèle local
		const teams: Team[] = await teamService.getTeamsByClub(club.id);
		for (const team of teams) {
			teamsChampionshipStore.remove(team.id);
			teamsChampionshipStore.load(team);
		}

		// Récupérer dans le cloud les joueurs et les charger dans le modèle local
		const players: Player[] = await playerService.getPlayersByClub(club.id);
		for (const player of players) {
			playersChampionshipStore.remove(player.id);
			playersChampionshipStore.load(player);
		}
	}

	return 'ok';
};
