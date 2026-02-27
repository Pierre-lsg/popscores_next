import type { Result } from '$lib/types/resultType';
import { db, pb } from './pocketBase';

export const resultService = {
	getAll: () => db.getFullList('results', { sort: 'created' }),

	getAllResults: async () => {
		const results = await db.getFullList('results', { sort: 'created' });
		return results.map((result) => result.data) as Result[];
	},

	getResultsByCompetition: async (competitionId: string) => {
		const results = await db.getFullList('results', { filter: `competition ~ "${competitionId}"` });
		return results.map((result) => result.data) as Result[];
	},

	getResultsByCompetitionAndPlayer: async (competitionId: string, playerId: string) => {
		const results = await db.getFullList('results', {
			filter: `competition="${competitionId}" && player="${playerId}"`
		});
		return results.map((result) => result.data) as Result[];
	},

	saveResult: (aResult: Result) => {
		const resultToSave = {
			competition: aResult.competitionId,
			player: aResult.playerId,
			owner: pb.authStore.record?.id,
			data: aResult
		};
		db.saveWithKey('results', resultToSave, 'competition, player');
	},

	saveResults: (results: Result[]) => {
		for (let aResult of results) {
			const resultToSave = {
				competition: aResult.competitionId,
				player: aResult.playerId,
				owner: pb.authStore.record?.id,
				data: aResult
			};
			db.saveWithKey('results', resultToSave, 'competition, player');
		}
	}
};
