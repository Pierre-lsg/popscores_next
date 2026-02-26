import type { Competition } from '$lib/types/competitionType';
import type { CompetitionStatus, CompetitionStep } from '$lib/types/competitionType';

const STORAGE_KEY = 'cs-competitions-data';

class CompetitionsStore {
	// List of competitions
	list = $state<Competition[]>([]);

	constructor() {
		if (typeof window !== 'undefined') {
			const savedData = localStorage.getItem(STORAGE_KEY);
			this.list = savedData ? JSON.parse(savedData) : [];

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
	add(
		name: string,
		status: CompetitionStatus,
		step: CompetitionStep,
		startDate?: string,
		scorePublicationDate?: string,
		location?: string
	): Competition {
		let aCompetition = {
			id: crypto.randomUUID(),
			name,
			status,
			step,
			startDate: startDate || '',
			scorePublicationDate: scorePublicationDate || '',
			location: location || '',
			regulationsId: '',
			teamsId: [],
			playersId: [],
			clubsId: [],
			flysId: []
		};
		this.list.push(aCompetition);
		return aCompetition;
	}

	/**
	 * Loads an external competition to the list.
	 *
	 * @param aCompetition - competition
	 */
	load(aCompetition: Competition) {
		this.list.push(aCompetition);
	}

	/**
	 * Find a competition from the list.
	 *
	 * @param id - ID of the competition to remove
	 */
	find(id: string): Competition | undefined {
		return this.list.find((c) => c.id === id);
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
