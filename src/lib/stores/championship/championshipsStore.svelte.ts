import type { Championship } from '$lib/types/championshipType';

const STORAGE_KEY = 'championship-data';

class ChampionsStore {
	// List of championships
	list = $state<Championship[]>([]);

	constructor() {
		if (typeof window !== 'undefined') {
			const savedData = localStorage.getItem(STORAGE_KEY);
			this.list = savedData ? JSON.parse(savedData) : [];

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
			season: '',
			location: '',
			competitionsId: [],
			collectiveScale: '',
			individualScale: ''
		});
	}

	/**
	 * Create a new championship and add it to the store.
	 */
	new(): Championship {
		let newChampionship: Championship = {
			id: crypto.randomUUID(),
			name: '',
			season: '',
			location: '',
			competitionsId: [],
			collectiveScale: crypto.randomUUID(),
			individualScale: crypto.randomUUID()
		};
		this.list.push(newChampionship);
		return newChampionship;
	}

	/**
	 * Loads an external championship to the list.
	 *
	 * @param aChampionship - championship
	 */
	load(aChampionship: Championship) {
		this.list.push(aChampionship);
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
