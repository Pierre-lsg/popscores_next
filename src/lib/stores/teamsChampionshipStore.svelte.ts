import type { Team } from '$lib/types/teamType';

// Constant for storage key
const STORAGE_KEY = 'golf-teams-championship-data';

/**
 * Class to encapsulate the state and methods of the teams championship store.
 */
class TeamsChampionshipStore {
	list = $state<Team[]>([]);

	constructor() {
		if (typeof window !== 'undefined') {
			const savedData = localStorage.getItem(STORAGE_KEY);
			if (savedData) {
				this.list = JSON.parse(savedData);
			}

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
		this.list.push({
			id: crypto.randomUUID(),
			name,
			playersId: [],
			clubId
		});
		console.log('Ajout équipe');
	}

	/**
	 * Remove a team from the championship list.
	 * @param id - The ID of the team to remove
	 */
	remove(id: string) {
		this.list = this.list.filter((t) => t.id !== id);
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
