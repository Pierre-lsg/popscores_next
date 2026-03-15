import type { Championship } from '$lib/types/championshipType';
import { untrack } from 'svelte';
import { messageStore } from '../appEventStore.svelte';

const STORAGE_KEY = 'championship-data';

class ChampionsStore {
	// List of championships
	list = $state<Championship[]>([]);
	isInitialLoading = true;

	constructor() {
		if (typeof window !== 'undefined') {
			const savedData = localStorage.getItem(STORAGE_KEY);
			this.list = savedData ? JSON.parse(savedData) : [];

			// Save data automatically when championships list changes
			$effect.root(() => {
				$effect(() => {
					const data = JSON.stringify(this.list);

					untrack(() => {
						localStorage.setItem(STORAGE_KEY, data);
						if (this.isInitialLoading) {
							this.isInitialLoading = false;
							return;
						}
						if (!messageStore.find('modifChamp'))
							messageStore.add(
								'modifChamp',
								'info',
								'Pensez à sauver le championnat dans le Cloud'
							);
					});
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
			individualScale: '',
			rankingClubs: [],
			rankingPlayers: [],
			status: 'in_progress',
			maxScoringTeams: 0,
			managersId: [],
			cpManagersId: []
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
			individualScale: crypto.randomUUID(),
			rankingClubs: [],
			rankingPlayers: [],
			status: 'in_progress',
			maxScoringTeams: 0,
			managersId: [],
			cpManagersId: []
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
