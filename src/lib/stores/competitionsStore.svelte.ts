import type { Competition } from '$lib/types/competitionType';

const STORAGE_KEY = 'golf-competitions-data';

class CompetitionsStore {
	// List of competitions
	list = $state<Competition[]>([]);

	constructor() {
		if (typeof window !== 'undefined') {
			const savedData = localStorage.getItem(STORAGE_KEY);
			this.list = savedData
				? JSON.parse(savedData)
				: [{ id: crypto.randomUUID(), name: 'à définir' }];

			// Save data automatically when competitions list changes
			$effect.root(() => {
				$effect(() => {
					localStorage.setItem(STORAGE_KEY, JSON.stringify(this.list));
				});
			});
		}
	}

	/**
	 * Adds a new competition to the list.
	 *
	 * @param name - Name of the competition
	 * @param startDate - Start date of the competition (optional)
	 * @param scorePublicationDate - Date when scores will be published (optional)
	 * @param location - Location of the competition (optional)
	 */
	add(name: string, startDate?: string, scorePublicationDate?: string, location?: string) {
		this.list.push({
			id: crypto.randomUUID(),
			name,
			startDate,
			scorePublicationDate,
			location
		});
	}

	/**
	 * Removes a competition from the list.
	 *
	 * @param id - ID of the competition to remove
	 */
	remove(id: string) {
		this.list = this.list.filter((c) => c.id !== id);
	}

	/**
	 * Resets the list of competitions.
	 */
	reset() {
		this.list = [];
	}
}

export const competitionsStore = new CompetitionsStore();
