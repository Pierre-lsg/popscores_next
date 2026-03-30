import type { User } from '$lib/types/userType';

// Constant for storage key
const STORAGE_KEY = 'cs-referees-data';

/**
 * Class to encapsulate the state and methods of the referees championship store.
 */
class RefereesChampionshipStore {
	list = $state<User[]>([]);

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
	 * Remove a referee from the championship list.
	 * @param id - The ID of the team to remove
	 */
	remove(id: string) {
		this.list = this.list.filter((r) => r.id !== id);
	}

	/**
	 * Loads an external referee to the list.
	 *
	 * @param aReferee - Referee
	 */
	load(aReferee: User) {
		this.list.push(aReferee);
	}

	/**
	 * Find a referee from the list.
	 *
	 * @param id - ID of the Referee to remove
	 */
	find(id: string): User | undefined {
		return this.list.find((r) => r.id === id);
	}

	/**
	 * Reset the referee list and remove data from localStorage.
	 */
	reset() {
		this.list = [];
		if (typeof window !== 'undefined') {
			localStorage.removeItem(STORAGE_KEY);
		}
	}
}

// Export a unique instance of the store (Singleton)
export const refereesStore = new RefereesChampionshipStore();
