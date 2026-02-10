import type { Player } from '$lib/types/playerType';
import { teamsChampionshipStore } from './teamsChampionshipStore.svelte';

const STORAGE_KEY = 'cs-players-data';

class PlayersChampionshipStore {
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

	// --- La vue dérivée (Remplaçante de playersWithTeams) ---
	// Elle est recalculée automatiquement si this.list ou teamsStore.list changent
	get playersWithTeams() {
		return this.list.map((player) => {
			const team = teamsChampionshipStore.list.find((t) => t.id === player.teamId);
			return {
				...player,
				teamName: team ? team.name : 'Individuel'
			};
		});
	}

	// Dans playersStore.svelte.ts
	// On ajoute une méthode simple pour récupérer le nom
	getTeamName(player: Player) {
		const team = teamsChampionshipStore.list.find((t) => t.id === player.teamId);
		return team ? team.name : player.name;
	}

	/**
	 * Gets a player by ID.
	 *
	 * @param playerId - The ID of the player to get.
	 * @returns The player object, or an empty player object if not found.
	 */
	getPlayerNameById(playerId: string) {
		const player = this.list.find((p) => p.id === playerId);
		return player ? player : { id: '', name: '', teamId: '', scores: {} };
	}

	/**
	 * Assigns a player to a team.
	 *
	 * @param playerId - The ID of the player to assign.
	 * @param teamId - The ID of the team to assign the player to.
	 */
	assignPlayerToTeam(playerId: string, teamId: string) {
		const player = this.list.find((p) => p.id === playerId);
		if (player) {
			player.teamId = teamId;
		}
	}

	// --- Méthodes d'actions ---

	/**
	 * Adds a new player to the list.
	 *
	 * @param name - The name of the player.
	 * @param surname - The surname of the player.
	 * @param nickname - The nickname of the player.
	 * @param clubId - The ID of the club the player belongs to.
	 */
	add(name: string, surname: string, nickname: string, clubId: string) {
		const aPlayer: Player = {
			id: crypto.randomUUID(),
			name,
			surname,
			nickname,
			clubId,
			teamId: '',
			scores: {}
		};

		this.list.push(aPlayer);
		return aPlayer;
	}

	/**
	 * Removes a player from the list.
	 *
	 * @param id - The ID of the player to remove.
	 */
	remove(id: string) {
		this.list = this.list.filter((p) => p.id !== id);
	}

	/**
	 * Updates a player's score for a specific target.
	 *
	 * @param playerId - The ID of the player whose score to update.
	 * @param targetId - The ID of the target to update the score for.
	 * @param value - The new score value.
	 */
	updateScore(playerId: string, targetId: string, value: number) {
		const player = this.list.find((p) => p.id === playerId);
		if (player) {
			// Svelte 5 détecte le changement dans l'objet interne
			player.scores[targetId] = value;
		}
	}

	/**
	 * Cleans up orphan scores that no longer correspond to active targets.
	 *
	 * @param activeTargetIds - The IDs of the currently active targets.
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
	 * Loads an external player to the list.
	 *
	 * @param aPlayer - Player
	 */
	load(aPlayer: Player) {
		this.list.push(aPlayer);
	}

	/**
	 * Find a Player from the list.
	 *
	 * @param id - ID of the Player to remove
	 */
	find(id: string): Player | undefined {
		return this.list.find((t) => t.id === id);
	}

	/**
	 * Resets the list of players and clears the local storage.
	 */
	reset() {
		this.list = [];
		if (typeof window !== 'undefined') {
			localStorage.removeItem(STORAGE_KEY);
		}
	}
}

export const playersChampionshipStore = new PlayersChampionshipStore();
