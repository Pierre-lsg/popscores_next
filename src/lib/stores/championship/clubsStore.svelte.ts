import type { Club } from '$lib/types/clubType';
import { untrack } from 'svelte';
import { messageStore } from '../appEventStore.svelte';

const STORAGE_KEY = 'cs-clubs-data';

class ClubsStore {
	list = $state<Club[]>([]);
	isInitialLoading = true;

	constructor() {
		if (typeof window !== 'undefined') {
			const savedData = localStorage.getItem(STORAGE_KEY);
			this.list = savedData ? JSON.parse(savedData) : [];

			// Sauvegarde automatique à chaque modification sur les clubs
			$effect.root(() => {
				$effect(() => {
					const data = JSON.stringify(this.list);

					untrack(() => {
						localStorage.setItem(STORAGE_KEY, data);
						if (this.isInitialLoading) {
							this.isInitialLoading = false;
							return;
						}
						if (!messageStore.find('modifClubs'))
							messageStore.add('modifClubs', 'info', 'Pensez à sauver les clubs dans le Cloud');
					});
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
			description: '',
			playersId,
			teamsId
		});
	}

	/**
	 * Loads an external club to the list.
	 *
	 * @param aClub - club
	 */
	load(aClub: Club) {
		this.list.push(aClub);
	}

	/**
	 * Find a club from the list.
	 *
	 * @param id - ID of the club to remove
	 */
	find(id: string): Club | undefined {
		return this.list.find((c) => c.id === id);
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
