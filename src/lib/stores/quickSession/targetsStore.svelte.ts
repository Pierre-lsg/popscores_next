import type { Target } from '$lib/types/targetsType';

const STORAGE_KEY = 'golf-targets-data';

class TargetsStore {
	// On initialise avec une liste vide, puis on charge le localStorage dans le constructeur
	list = $state<Target[]>([]);

	constructor() {
		if (typeof window !== 'undefined') {
			const savedData = localStorage.getItem(STORAGE_KEY);
			this.list = savedData ? JSON.parse(savedData) : [];

			// Sauvegarde automatique à chaque modification de la liste ou d'un par
			$effect.root(() => {
				$effect(() => {
					localStorage.setItem(STORAGE_KEY, JSON.stringify(this.list));
				});
			});
		}
	}

	/**
	 * Adds a new target to the list.
	 *
	 * @param par The par value for the new target
	 * @param name The name of the new target
	 * @param rule The rule for the new target
	 */
	add(par: number, name: string, rule: string) {
		this.list.push({
			id: crypto.randomUUID(),
			par: Number(par) || 0,
			name,
			rule
		});
	}
	/**
	 * Updates the par value for a target at a given index in the list.
	 *
	 * @param index The index of the target to update
	 * @param newPar The new par value to set for the target
	 */
	updatePar(index: number, newPar: number) {
		if (this.list[index]) {
			this.list[index].par = Number(newPar) || 0;
		}
	}

	/**
	 * Moves a target from one index to another in the list.
	 *
	 * @param fromIndex The current index of the target to move
	 * @param toIndex The new index for the target
	 */
	moveTarget(fromIndex: number, toIndex: number) {
		const item = this.list[fromIndex];
		this.list.splice(fromIndex, 1); // Retire
		this.list.splice(toIndex, 0, item); // Insère
	}

	/**
	 * Adds a new target with default values to the list.
	 */
	addTarget() {
		this.list.push({
			id: crypto.randomUUID(), // Identifiant unique stable
			par: 4,
			rule: 'Individuel'
		});
	}

	/**
	 * Removes a target at a given index from the list.
	 *
	 * @param index The index of the target to remove
	 */
	remove(index: number) {
		this.list.splice(index, 1);
	}

	/**
	 * Resets the list to contain only one target with default values.
	 */
	reset() {
		this.list = [];
	}
}

export const targetsStore = new TargetsStore();
