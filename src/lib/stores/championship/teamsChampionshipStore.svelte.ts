import type { Team } from '$lib/types/teamType';

// Constant for storage key
const STORAGE_KEY = 'cs-teams-data';

/**
 * Class to encapsulate the state and methods of the teams championship store.
 */
class TeamsChampionshipStore {
	list = $state<Team[]>([]);

	constructor() {
		if (typeof window !== 'undefined') {
			const savedData = localStorage.getItem(STORAGE_KEY);
			this.list = savedData ? JSON.parse(savedData) : [];

			$effect.root(() => {
				$effect(() => {
					localStorage.setItem(STORAGE_KEY, JSON.stringify(this.list));
				});
			});
		}
	}

	/**
	 * Add a team to the championship list.
	 * @param name - The name of the team
	 * @param clubId - The ID of the club associated with the team
	 */
	add(name: string, clubId: string) {
		const aTeam: Team = {
			id: crypto.randomUUID(),
			name,
			playersId: [],
			clubId
		};

		this.list.push(aTeam);
		return aTeam;
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
	 * @param id - ID of the Team to remove
	 */
	find(id: string): Team | undefined {
		return this.list.find((t) => t.id === id);
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
export const teamsChampionshipStore = new TeamsChampionshipStore();
