import type { Championship } from '$lib/types/championshipType';

const STORAGE_KEY = 'golf-championship-data';

class ChampionsStore {
	// List of championships
	list = $state<Championship[]>([]);

	constructor() {
		if (typeof window !== 'undefined') {
			const savedData = localStorage.getItem(STORAGE_KEY);
			this.list = savedData
				? JSON.parse(savedData)
				: [{ id: crypto.randomUUID(), name: 'à définir' }];

			// Save data automatically when championships list changes
			$effect.root(() => {
				$effect(() => {
					localStorage.setItem(STORAGE_KEY, JSON.stringify(this.list));
				});
			});
		}
	}

	/**
	 * Adds a new championship to the list.
	 *
	 * @param name - Name of the championship
	 * @param season - Season of the championship. ie : 2026 | 2025 - 2026
	 * @param location - Location of the championship (optional)
	 */
	add(name: string, season?: string, location?: string) {
		this.list.push({
			id: crypto.randomUUID(),
			name,
			season,
			location
		});
	}

	/**
	 * Removes a championship from the list.
	 *
	 * @param id - ID of the championship to remove
	 */
	remove(id: string) {
		this.list = this.list.filter((c) => c.id !== id);
	}

	/**
	 * Resets the list of championships.
	 */
	reset() {
		this.list = [];
	}
}

export const championshipStore = new ChampionsStore();
