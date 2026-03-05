import type { Team } from '$lib/types/teamType';
import { untrack } from 'svelte';
import { messageStore } from '../appEventStore.svelte';

// Constant for storage key
const STORAGE_KEY = 'cp-teams-data';

/**
 * Class to encapsulate the state and methods of the teams championship store.
 */
class TeamsCompetitionStore {
	list = $state<Team[]>([]);
	isInitialLoading = true;

	constructor() {
		if (typeof window !== 'undefined') {
			const savedData = localStorage.getItem(STORAGE_KEY);
			this.list = savedData ? JSON.parse(savedData) : [];

			$effect.root(() => {
				$effect(() => {
					const data = JSON.stringify(this.list);

					untrack(() => {
						localStorage.setItem(STORAGE_KEY, data);
						if (this.isInitialLoading) {
							this.isInitialLoading = false;
							return;
						}
						if (!messageStore.find('modifCpTeam'))
							messageStore.add('modifCpTeam', 'info', 'Pensez à sauver les équipes dans le Cloud');
					});
				});
			});
		}
	}

	/**
	 * Remove a team from the championship list.
	 * @param id - The ID of the team to remove
	 */
	remove(id: string) {
		this.list = this.list.filter((t) => t.id !== id);
	}

	/**
	 * Loads an external team to the list.
	 *
	 * @param aTeam - Team
	 */
	load(aTeam: Team) {
		this.list.push(aTeam);
	}

	/**
	 * Find a team from the list.
	 *
	 * @param id - ID of the Team to find
	 */
	find(id: string): Team | undefined {
		return this.list.find((t) => t.id === id);
	}

	/**
	 * Find a team from the list.
	 *
	 * @param id - ID of the Team to find
	 * @param sessionId - session ID of the Team to find
	 */
	findByIdAndSession(id: string, sessionId: string): Team | undefined {
		return this.list.find((t) => t.id === id && t.sessionId === sessionId);
	}

	/**
	 * Reset the championship list and remove data from localStorage.
	 */
	reset() {
		this.list = [];
		if (typeof window !== 'undefined') {
			localStorage.removeItem(STORAGE_KEY);
		}
	}
}

// Export a unique instance of the store (Singleton)
export const teamsCompetitionStore = new TeamsCompetitionStore();
