import type { Result } from '$lib/types/resultType';

// Constant for storage key
const STORAGE_KEY = 'cp-result-data';

/**
 * Class to encapsulate the state and methods of the result's competition store.
 */
class ResultsCompetitionStore {
	list = $state<Result[]>([]);

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
	 * Add a competition's results
	 * @param competitionId - The competition Id
	 * @param playerId - The player Id
	 */
	add(competitionId: string, playerId: string, scores: Record<string, number>) {
		const aResult: Result = {
			competitionId,
			playerId,
			scores
		};

		this.list.push(aResult);
		return aResult;
	}

	/**
	 * Remove a competition's result
	 * @param competitionId - ID of the competition
	 * @param playerId - ID of the player
	 */
	remove(competitionId: string, playerId: string) {
		this.list = this.list.filter(
			(item) => item.competitionId !== competitionId || item.playerId !== playerId
		);
	}

	/**
	 * Loads an external result to the list.
	 *
	 * @param aTeam - Team
	 */
	load(aTeam: Result) {
		this.list.push(aTeam);
	}

	/**
	 * Find a result from the list.
	 *
	 * @param competitionId - ID of the competition
	 * @param playerId - ID of the player
	 */
	find(competitionId: string, playerId: string): Result | undefined {
		return this.list.find((r) => r.competitionId === competitionId && r.playerId === playerId);
	}

	/**
	 * Find a result from the list.
	 *
	 * @param competitionId - ID of the competition
	 */
	findByCompetition(competitionId: string): Result | undefined {
		return this.list.find((r) => r.competitionId === competitionId);
	}

	/**
	 * Reset the result list and remove data from localStorage.
	 */
	reset() {
		this.list = [];
		if (typeof window !== 'undefined') {
			localStorage.removeItem(STORAGE_KEY);
		}
	}
}

// Export a unique instance of the store (Singleton)
export const resultsCompetitionStore = new ResultsCompetitionStore();
