import type { Club } from '$lib/types/clubType';
import type { Team } from '$lib/types/teamType';
import type { Player } from '$lib/types/playerType';
import { teamsChampionshipStore } from '$lib/stores/championship/teamsChampionshipStore.svelte';
import { playersChampionshipStore } from '$lib/stores/championship/playersChampionshipStore.svelte';
import { teamService } from '../pocketbase/teams2Cloud';
import { playerService } from '../pocketbase/players2Cloud';
import { clubService } from '../pocketbase/clubs2Cloud';

export const cloudSaveClubs = async (clubs: Club[]): Promise<string> => {
	let status: string = 'success';

	for (let club of clubs) {
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

		// Lister et sauver les équipes
		for (let playerId of club.playersId) {
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

		// sauver le club
		try {
			clubService.saveClub(club);
		} catch (e) {
			console.log('error', e);
			status = 'failure';
		}
	}

	return status;
};
