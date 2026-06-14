import type { ScoreCard } from '$lib/types/scoreCardType';
import { db, pb } from './pocketBase';

export const scoreCardService = {
	getAll: () => db.getFullList<{ data: ScoreCard }>('scorecards', { sort: 'created' }),

	getAllScoreCards: async () => {
		const scoreCards = await db.getFullList<{ data: ScoreCard }>('scorecards', { sort: 'created' });
		return scoreCards.map((scoreCard) => scoreCard.data) as ScoreCard[];
	},

	getScoreCardByCompetition: async (competitionId: string) => {
		const scoreCards = await db.getFullList<{ data: ScoreCard }>('scorecards', {
			filter: `competition ~ "${competitionId}"`
		});
		return scoreCards.map((scoreCard) => scoreCard.data) as ScoreCard[];
	},

	getScoreCardByFly: async (flyId: string) => {
		const scoreCards = await db.getFullList<{ data: ScoreCard }>('scorecards', { filter: `fly ~ "${flyId}"` });
		return scoreCards.map((scoreCard) => scoreCard.data) as ScoreCard[];
	},

	saveScoreCard: async (aScoreCard: ScoreCard) => {
		const scoreCardToSave = {
			competition: aScoreCard.competition.id,
			fly: aScoreCard.fly.id,
			owner: pb.authStore.record?.id,
			data: aScoreCard
		};
		return await db.saveWithKey('scorecards', scoreCardToSave, 'competition, fly');
	},

	saveScoreCards: async (scoreCards: ScoreCard[]) => {
		const promises = scoreCards.map((aScoreCard) => {
			const scoreCardToSave = {
				competition: aScoreCard.competition.id,
				fly: aScoreCard.fly.id,
				owner: pb.authStore.record?.id,
				data: aScoreCard
			};
			return db.saveWithKey('scorecards', scoreCardToSave, 'competition, fly');
		});
		return await Promise.all(promises);
	}
};
