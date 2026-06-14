import type { Competition } from '$lib/types/competitionType';
import type { CompetitionStatus, CompetitionStep } from '$lib/types/competitionType';
import { untrack } from 'svelte';
import { messageStore } from '../appEventStore.svelte';

const STORAGE_KEY = 'cs-competitions-data';

class CompetitionsStore {
	// List of competitions
	list = $state<Competition[]>([]);
	isInitialLoading = true;

	constructor() {
		if (typeof window !== 'undefined') {
			const savedData = localStorage.getItem(STORAGE_KEY);
			this.list = savedData ? JSON.parse(savedData) : [];

			// Save data automatically when competitions list changes
			$effect.root(() => {
				$effect(() => {
					const data = JSON.stringify(this.list);

					untrack(() => {
						localStorage.setItem(STORAGE_KEY, data);
						if (this.isInitialLoading) {
							this.isInitialLoading = false;
							return;
						}
						if (!messageStore.find('modifComp'))
							messageStore.add('modifComp', 'info', 'Pensez à sauver la compétition dans le Cloud');
					});
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
	 * @param managersId - Location of the competition (optional)
	 */
	add(
		name: string,
		status: CompetitionStatus,
		step: CompetitionStep,
		startDate?: string,
		scorePublicationDate?: string,
		location?: string,
		managersId?: string[]
	): Competition {
		const aCompetition = {
			id: crypto.randomUUID(),
			name,
			status,
			step,
			startDate: startDate || '',
			scorePublicationDate: scorePublicationDate || '',
			location: location || '',
			regulationsId: '',
			courseId: '',
			teamsId: [],
			playersId: [],
			clubsId: [],
			flysId: [],
			managersId: managersId || []
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
