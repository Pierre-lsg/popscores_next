import type { Regulations, Regulation } from '$lib/types/regulationsType';

const STORAGE_KEY = 'cs-regulations-data';

class RegulationsStore {
	// List of Regulations
	list = $state<Regulations[]>([]);

	constructor() {
		if (typeof window !== 'undefined') {
			const savedData = localStorage.getItem(STORAGE_KEY);
			this.list = savedData ? JSON.parse(savedData) : [];

			// Save data automatically when Regulations list changes
			$effect.root(() => {
				$effect(() => {
					localStorage.setItem(STORAGE_KEY, JSON.stringify(this.list));
				});
			});
		}
	}

	/**
	 * Create a new regulation to the list.
	 *
	 * @param aRegulation - Regulation
	 */
	new(): Regulations {
		let regulation: Regulation = {
			hasCrossAFixedPenalty: false,
			malusValue: 10,
			malusOverPar: 4,
			teamGame: false,
			usePenalizingGhost: false,
			playersPerTeam: 2
		};

		let aRegulation: Regulations = {
			id: crypto.randomUUID(),
			teamsPerFly: 3,
			playersPerFly: 6,
			regulation: regulation,
			doubleRanking: false,
			nbPlayersForDoubleRankingTeam: 2
		};
		this.list.push(aRegulation);
		return aRegulation;
	}

	/**
	 * Loads an external Regulation to the list.
	 *
	 * @param aRegulation - Regulation
	 */
	load(aRegulation: Regulations) {
		this.list.push(aRegulation);
	}

	/**
	 * Find a Regulation from the list.
	 *
	 * @param id - ID of the Regulation to remove
	 */
	find(id: string): Regulations | undefined {
		return this.list.find((c) => c.id === id);
	}

	/**
	 * Removes a Regulation from the list.
	 *
	 * @param id - ID of the Regulation to remove
	 */
	remove(id: string) {
		this.list = this.list.filter((c) => c.id !== id);
	}

	/**
	 * Resets the list of Regulations.
	 */
	reset() {
		this.list = [];
	}
}

export const regulationsStore = new RegulationsStore();
