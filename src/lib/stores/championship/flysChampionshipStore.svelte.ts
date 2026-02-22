import type { Fly } from '$lib/types/flyType';

// Constant for storage key
const STORAGE_KEY = 'cs-flys-data';

/**
 * Class to encapsulate the state and methods of the flys championship store.
 */
class FlysChampionshipStore {
	list = $state<Fly[]>([]);

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
	 * Add a fly to the championship list.
	 * @param order - The order of the fly
	 */
	add(order: number, competitionId: string) {
		const aFly: Fly = {
			id: crypto.randomUUID(),
			order,
			competitionId,
			playersId: [],
			teamsId: [],
			status: 'not_started',
			supervisorId: ''
		};

		this.list.push(aFly);
		return aFly;
	}

	/**
	 * Remove a fly from the championship list.
	 * @param id - The ID of the fly to remove
	 */
	remove(id: string) {
		this.list = this.list.filter((f) => f.id !== id);
	}

	/**
	 * Loads an external fly to the list.
	 *
	 * @param aFly - fly
	 */
	load(aFly: Fly) {
		this.list.push(aFly);
	}

	/**
	 * Find a fly from the list.
	 *
	 * @param id - ID of the Fly to remove
	 */
	find(id: string): Fly | undefined {
		return this.list.find((f) => f.id === id);
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
export const flysChampionshipStore = new FlysChampionshipStore();
