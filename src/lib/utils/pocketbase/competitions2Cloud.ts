import type { Competition } from '$lib/types/competitionType';
import { db, pb } from './pocketBase';

export const competitionService = {
	getAll: () => db.getFullList('competitions', { sort: 'created' }),

	getByChampionshipId: (csId: string) =>
		db.getFullList('competitions', {
			filter: `championship ~ "${csId}"`
		}),

	getById: (id: string) =>
		db.getFullList('competitions', {
			filter: `id ~ "${id}"`
		}),

	saveCompetition: (aCompetition: Competition, championshipId: string) => {
		const competitionToSave = {
			id: aCompetition.id,
			name: aCompetition.name,
			championship: championshipId,
			owner: pb.authStore.record?.id,
			data: aCompetition
		};

		try {
			db.update('competitions', competitionToSave);
		} catch (err) {
			db.create('competitions', competitionToSave);
		}
	},
	createCompetition: (aCompetition: Competition, championshipId: string) => {
		const competitionToSave = {
			id: aCompetition.id,
			name: aCompetition.name,
			championship: championshipId,
			owner: pb.authStore.record?.id,
			data: aCompetition
		};
		db.create('competitions', competitionToSave);
	},

	updateCompetition: (aCompetition: Competition, championshipId: string) => {
		const competitionToSave = {
			id: aCompetition.id,
			name: aCompetition.name,
			championship: championshipId,
			owner: pb.authStore.record?.id,
			data: aCompetition
		};
		db.update('competitions', competitionToSave);
	}
};
