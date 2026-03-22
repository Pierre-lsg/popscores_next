import type { Player } from '$lib/types/playerType';

const STORAGE_KEY = 'qs-regulars-data';

class RegularPlayersStore {
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
	 * Remove a Player from the list.
	 * @param id - The ID of the Player to remove
	 */
	remove(id: string) {
		this.list = this.list.filter((t) => t.id !== id);
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
	loads(players: Player[]) {
		players.forEach((player) => {
			if (!this.list.some((lp) => lp.id === player.id)) this.list.push(player);
		});
	}

	/**
	 * Find a Player from the list.
	 *
	 * @param id - ID of the Player to remove
	 */
	find(id: string): Player | undefined {
		return this.list.find((p) => p.id === id);
	}

	/**
	 * Reset the list and remove data from localStorage.
	 */
	reset() {
		this.list = [];
		if (typeof window !== 'undefined') {
			localStorage.removeItem(STORAGE_KEY);
		}
	}
}

export const regularsStore = new RegularPlayersStore();
