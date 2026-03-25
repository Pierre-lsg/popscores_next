import type { Team } from '$lib/types/teamType';

const STORAGE_KEY = 'golf-teams-data';

/**
 * A class to encapsulate state and methods related to teams.
 */
class TeamsStore {
	// The rune $state makes the array reactive.
	// It initializes with localStorage if we are in the browser.
	list = $state<Team[]>([]);

	constructor() {
		if (typeof window !== 'undefined') {
			const savedData = localStorage.getItem(STORAGE_KEY);
			this.list = savedData ? JSON.parse(savedData) : [];

			// The rune $effect watches for changes to `this.list`.
			// Whenever it changes, it automatically saves.
			$effect.root(() => {
				$effect(() => {
					localStorage.setItem(STORAGE_KEY, JSON.stringify(this.list));
				});
			});
		}
	}

	/**
	 * Adds a new team to the list.
	 * @param id - The id of the team
	 * @param name - The name of the team
	 * @param playersId[] - A collection of player's id
	 */
	add(id: string, name: string, playersId: string[]) {
		this.list.push({ id, name, playersId, clubId: '', sessionId: '' });
	}

	/**
	 * Removes a team from the list.
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
	 * @param id - ID of the Team to remove
	 */
	find(id: string): Team | undefined {
		return this.list.find((t) => t.id === id);
	}

	/**
	 * Resets the team list and removes the stored data from localStorage.
	 */
	reset() {
		this.list = [];
		if (typeof window !== 'undefined') {
			localStorage.removeItem(STORAGE_KEY);
		}
	}
}

// Export a single instance of TeamsStore to be used throughout the application.
export const teamsStore = new TeamsStore();
