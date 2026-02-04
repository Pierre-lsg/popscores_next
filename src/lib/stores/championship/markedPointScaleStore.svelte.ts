import type { MarkedPointScale } from '$lib/types/markedPointScaleType';

const STORAGE_KEY = 'golf-markedpointscale-data';

class MarkedPointScaleStore {
	// List of markedPointScale
	list = $state<MarkedPointScale[]>([]);

	constructor() {
		if (typeof window !== 'undefined') {
			const savedData = localStorage.getItem(STORAGE_KEY);
			this.list = savedData ? JSON.parse(savedData) : [];

			// Save data automatically when scale list changes
			$effect.root(() => {
				$effect(() => {
					localStorage.setItem(STORAGE_KEY, JSON.stringify(this.list));
				});
			});
		}
	}

	/**
	 * Adds a new markedPointScale to the list.
	 *
	 * @param id - Identifiant of the markedPointScale
	 * @param name - Name of the markedPointScale
	 * @param isIndividual - scale for individual or collective ranking
	 * @param points - Marked point scale
	 */
	add(id: string, name: string, isIndividual: boolean, points: number[]) {
		this.list.push({
			id,
			name,
			isIndividual,
			points
		});
	}

	/**
	 * Create a new markedPointScale to the list.
	 */
	new(isIndividual: boolean): MarkedPointScale {
		let newScale: MarkedPointScale = {
			id: crypto.randomUUID(),
			name: '',
			points: [],
			isIndividual: isIndividual
		};
		this.list.push(newScale);
		return newScale;
	}

	/**
	 * Gets a markedPointScale by its ID.
	 *
	 * @param id - ID of the markedPointScale
	 * @returns The markedPointScale with the given ID, or undefined if not found.
	 */
	getScaleById(id: string): MarkedPointScale | undefined {
		return this.list.find((scale) => scale.id === id);
	}

	/**
	 * Removes a marked point scale from the list.
	 *
	 * @param id - ID of the marked point scale to remove
	 */
	remove(id: string) {
		this.list = this.list.filter((c) => c.id !== id);
	}

	/**
	 * Resets the list of marked point scale.
	 */
	reset() {
		this.list = [];
	}
}

export const mpsStore = new MarkedPointScaleStore();
