import type { scoreCard } from '$lib/types/scoreCardType';
import { db, pb } from './pocketBase';

export const scoreCardService = {
	getAll: () => db.getFullList('scorecards', { sort: 'created' }),

	getAllScoreCards: async () => {
		const scoreCards = await db.getFullList('scorecards', { sort: 'created' });
		return scoreCards.map((scoreCard) => scoreCard.data) as scoreCard[];
	},

	getScoreCardByCompetition: async (competitionId: string) => {
		const scoreCards = await db.getFullList('scorecards', {
			filter: `competition ~ "${competitionId}"`
		});
		return scoreCards.map((scoreCard) => scoreCard.data) as scoreCard[];
	},

	getScoreCardByFly: async (flyId: string) => {
		const scoreCards = await db.getFullList('scorecards', { filter: `fly ~ "${flyId}"` });
		return scoreCards.map((scoreCard) => scoreCard.data) as scoreCard[];
	},

	saveScoreCard: (aScoreCard: scoreCard) => {
		const scoreCardToSave = {
			competition: aScoreCard.competition.id,
			fly: aScoreCard.fly.id,
			owner: pb.authStore.record?.id,
			data: aScoreCard
		};
		db.saveWithKey('scorecards', scoreCardToSave, 'competition, fly');
	},

	saveScoreCards: (scoreCards: scoreCard[]) => {
		for (let aScoreCard of scoreCards) {
			const scoreCardToSave = {
				competition: aScoreCard.competition.id,
				fly: aScoreCard.fly.id,
				owner: pb.authStore.record?.id,
				data: aScoreCard
			};
			db.saveWithKey('scorecards', scoreCardToSave, 'competition, fly');
		}
	}
};
