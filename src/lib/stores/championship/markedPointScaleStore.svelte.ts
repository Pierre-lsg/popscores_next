import type { MarkedPointScale } from '$lib/types/markedPointScaleType';
import { untrack } from 'svelte';
import { messageStore } from '../appEventStore.svelte';

const STORAGE_KEY = 'cs-markedpointscale-data';

class MarkedPointScaleStore {
	// List of markedPointScale
	list = $state<MarkedPointScale[]>([]);
	isInitialLoading = true;

	constructor() {
		if (typeof window !== 'undefined') {
			const savedData = localStorage.getItem(STORAGE_KEY);
			this.list = savedData ? JSON.parse(savedData) : [];

			// Save data automatically when scale list changes
			$effect.root(() => {
				$effect(() => {
					const data = JSON.stringify(this.list);

					untrack(() => {
						localStorage.setItem(STORAGE_KEY, data);
						if (this.isInitialLoading) {
							this.isInitialLoading = false;
							return;
						}
						if (!messageStore.find('modifChamp'))
							messageStore.add(
								'modifChamp',
								'info',
								'Pensez à sauver le championnat (mps) dans le Cloud'
							);
					});
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
		let newScale: MarkedPointScale = {
			id,
			name,
			points,
			isIndividual
		};
		this.list.push(newScale);
		return newScale;
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
	 * Loads an external MarkedPointScale to the list.
	 *
	 * @param aMarkedPointScale - MarkedPointScale
	 */
	load(aMarkedPointScale: MarkedPointScale) {
		this.list.push(aMarkedPointScale);
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
