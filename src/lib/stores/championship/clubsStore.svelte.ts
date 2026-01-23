import type { Club } from '$lib/types/clubType';

const STORAGE_KEY = 'golf-clubs-data';

class ClubsStore {
	list = $state<Club[]>([]);

	constructor() {
		if (typeof window !== 'undefined') {
			const savedData = localStorage.getItem(STORAGE_KEY);
			this.list = savedData
				? JSON.parse(savedData)
				: [{ id: crypto.randomUUID(), name: 'à définir' }];

			// Sauvegarde automatique à chaque modification sur les clubs
			$effect.root(() => {
				$effect(() => {
					localStorage.setItem(STORAGE_KEY, JSON.stringify(this.list));
				});
			});
		}
	}

	/**
	 * Adds a new club to the list.
	 *
	 * @param name - The name of the club.
	 * @param description - A description of the club (optional).
	 * @param playersId - An array of player IDs associated with the club (optional).
	 * @param teamsId - An array of team IDs associated with the club (optional).
	 */
	add(name: string, description?: string, playersId: string[] = [], teamsId: string[] = []) {
		this.list.push({
			id: crypto.randomUUID(),
			name,
			description,
			playersId,
			teamsId
		});
	}

	/**
	 * Removes a club from the list.
	 *
	 * @param id - The ID of the club to remove.
	 */
	remove(id: string) {
		this.list = this.list.filter((c) => c.id !== id);
	}

	/**
	 * Resets the club list to an empty array.
	 */
	reset() {
		this.list = [];
	}
}

export const clubsStore = new ClubsStore();
