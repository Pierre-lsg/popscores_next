import type { Competition } from '$lib/types/competitionType';
import { db, pb } from './pocketBase';

export const competitionService = {
	getAll: () => db.getFullList<{ data: Competition }>('competitions', { sort: 'created' }),

	getAllCompetitions: async () => {
		const competitions = await db.getFullList<{ data: Competition }>('competitions', { sort: 'created' });
		return competitions.map((competition) => competition.data) as Competition[];
	},

	getCompetitionsByChampionship: async (csId: string) => {
		const competitions = await db.getFullList<{ data: Competition }>('competitions', {
			filter: `championship ~ "${csId}"`
		});
		return competitions.map((competition) => competition.data) as Competition[];
	},

	getByChampionshipId: (csId: string) =>
		db.getFullList<{ data: Competition }>('competitions', {
			filter: `championship ~ "${csId}"`
		}),

	getById: (id: string) =>
		db.getFullList<{ data: Competition }>('competitions', {
			filter: `id ~ "${id}"`
		}),

	getCompetitionById: async (id: string) => {
		const competitions = await db.getFullList<{ data: Competition }>('competitions', {
			filter: `id ~ "${id}"`
		});
		return competitions.map((competition) => competition.data)[0] as Competition;
	},

	saveCompetition: async (aCompetition: Competition, championshipId: string) => {
		const competitionToSave = {
			id: aCompetition.id,
			name: aCompetition.name,
			championship: championshipId,
			owner: pb.authStore.record?.id,
			data: aCompetition
		};
		return await db.save('competitions', competitionToSave);
	},

	createCompetition: async (aCompetition: Competition, championshipId: string) => {
		const competitionToSave = {
			id: aCompetition.id,
			name: aCompetition.name,
			championship: championshipId,
			owner: pb.authStore.record?.id,
			data: aCompetition
		};
		return await db.create('competitions', competitionToSave);
	},

	updateCompetition: async (aCompetition: Competition, championshipId: string) => {
		const competitionToSave = {
			id: aCompetition.id,
			name: aCompetition.name,
			championship: championshipId,
			owner: pb.authStore.record?.id,
			data: aCompetition
		};
		return await db.update('competitions', competitionToSave);
	}
};
