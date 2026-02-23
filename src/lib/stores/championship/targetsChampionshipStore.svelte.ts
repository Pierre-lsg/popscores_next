import type { Target } from '$lib/types/targetType';

// Constant for storage key
const STORAGE_KEY = 'cs-targets-data';

/**
 * Class to encapsulate the state and methods of the targets championship store.
 */
class TargetsChampionshipStore {
	list = $state<Target[]>([]);

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
	 * Add a target
	 * @param name - The name of the target
	 * @param par - The par of the target
	 * @param rule - The par of the target
	 */
	add(name: string, par: number, rule: string): Target {
		const aTarget: Target = {
			id: crypto.randomUUID(),
			name,
			par,
			rule
		};

		this.list.push(aTarget);
		return aTarget;
	}

	/**
	 * Create a new blank target
	 */
	new(): Target {
		const aTarget: Target = {
			id: crypto.randomUUID(),
			name: 'Titre',
			par: 4,
			rule: 'Individuel'
		};

		this.list.push(aTarget);
		return aTarget;
	}

	/**
	 * Remove a target from the championship list.
	 * @param id - The ID of the target to remove
	 */
	remove(id: string) {
		this.list = this.list.filter((t) => t.id !== id);
	}

	/**
	 * Loads an external target to the list.
	 *
	 * @param aTarget - Target
	 */
	load(aTarget: Target) {
		this.list.push(aTarget);
	}

	/**
	 * Find a target from the list.
	 *
	 * @param id - ID of the Target to remove
	 */
	find(id: string): Target | undefined {
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
export const targetsChampionshipStore = new TargetsChampionshipStore();
