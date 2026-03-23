import type { Player } from '$lib/types/playerType';
import { teamsStore } from './teamsStore.svelte';

const STORAGE_KEY = 'golf-players-data';

class PlayersStore {
	// État de base (la liste brute)
	list = $state<Player[]>([]);

	unassignedPlayers = $derived(this.list.filter((player) => player.teamId === ''));
	assignedPlayers = $derived(this.list.filter((player) => player.teamId !== ''));

	constructor() {
		if (typeof window !== 'undefined') {
			const savedData = localStorage.getItem(STORAGE_KEY);
			this.list = savedData ? JSON.parse(savedData) : [];

			// Sauvegarde automatique dès que la liste (ou un élément de la liste) change
			$effect.root(() => {
				$effect(() => {
					localStorage.setItem(STORAGE_KEY, JSON.stringify(this.list));
				});
			});
		}
	}

	/**
	 * Returns an array of players with their corresponding team names
	 */
	get playersWithTeams() {
		return this.list.map((player) => {
			const team = teamsStore.list.find((t) => t.id === player.teamId);
			return {
				...player,
				teamName: team ? team.name : 'Individuel'
			};
		});
	}

	/**
	 * Retrieves the team name of a given player
	 * @param player - The player object to retrieve the team name for
	 */
	getTeamName(player: Player) {
		const team = teamsStore.list.find((t) => t.id === player.teamId);
		return team ? team.name : player.name;
	}

	/**
	 * Retrieves a player by their ID
	 * @param playerId - The ID of the player to retrieve
	 */
	getPlayerNameById(playerId: string) {
		const player = this.list.find((p) => p.id === playerId);
		return player ? player : { id: '', name: '', teamId: '', scores: {} };
	}

	/**
	 * Assigns a player to a team by updating their team ID
	 * @param playerId - The ID of the player to assign to a team
	 * @param teamId - The ID of the team to assign the player to
	 */
	assignPlayerToTeam(playerId: string, teamId: string) {
		const player = this.list.find((p) => p.id === playerId);
		if (player) {
			player.teamId = teamId;
		}
	}

	/**
	 * Adds a new player with the given name and an empty team ID
	 * @param name - The name of the player to add
	 */
	add(name: string) {
		this.list.push({
			id: crypto.randomUUID(),
			name,
			surname: '',
			nickname: '',
			teamId: '',
			scores: {}
		});
	}

	/**
	 * Removes a player from the list by their ID
	 * @param id - The ID of the player to remove
	 */
	remove(id: string) {
		this.list = this.list.filter((p) => p.id !== id);
	}
	/**
	 * Retrieves the scores of each player for a given target
	 * @param targetId - The ID of the target to retrieve scores for
	 */
	getPlayersScore(targetId: string) {
		return this.list.map((player) => ({
			playerId: player.id,
			name: player.name,
			score: player.scores[targetId]
		}));
	}

	/**
	 * Updates the score for a given target and player
	 * @param playerId - The ID of the player whose score is being updated
	 * @param targetId - The ID of the target whose score is being updated
	 * @param value - The new score value to update
	 */
	updateScore(playerId: string, targetId: string, value: number) {
		const player = this.list.find((p) => p.id === playerId);
		if (player) {
			player.scores[targetId] = value;
		}
	}

	/**
	 * Cleans up any orphaned scores that no longer correspond to active targets
	 * @param activeTargetIds - An array of the IDs of active targets
	 */
	cleanOrphanScores(activeTargetIds: string[]) {
		this.list.forEach((player) => {
			Object.keys(player.scores).forEach((targetId) => {
				if (!activeTargetIds.includes(targetId)) {
					delete player.scores[targetId];
				}
			});
		});
	}

	/**
	 * Loads an external Player to the list.
	 *
	 * @param aPlayer - Player
	 */
	load(aPlayer: Player) {
		this.list.push(aPlayer);
	}

	/**
	 * Loads an external Player to the list.
	 *
	 * @param aPlayer - Player
	 */
	exist(aPlayer: Player) {
		return this.list.find((p) => p.id === aPlayer.id) ? true : false;
	}

	/**
	 * Resets the list of players and removes any saved data from localStorage
	 */
	reset() {
		this.list = [];
		if (typeof window !== 'undefined') {
			localStorage.removeItem(STORAGE_KEY);
		}
	}
}

export const playersStore = new PlayersStore();
