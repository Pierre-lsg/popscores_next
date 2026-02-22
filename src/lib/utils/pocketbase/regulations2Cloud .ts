import type { Regulations } from '$lib/types/regulationsType';
import { db, pb } from './pocketBase';

export const regulationService = {
	getAll: () => db.getFullList('regulations', { sort: 'created' }),

	getAllRegulations: async () => {
		const regulations = await db.getFullList('regulations', { sort: 'created' });
		return regulations.map((regulation) => regulation.data) as Regulations[];
	},

	getById: (id: string) => db.getOne('regulations', id, {}),

	getRegulationById: async (id: string) => {
		const regulation = await db.getOne('regulations', id, {});
		return regulation?.data;
	},

	saveRegulation: (aRegulation: Regulations) => {
		const regulationToSave = {
			id: aRegulation.id,
			owner: pb.authStore.record?.id,
			data: aRegulation
		};
		db.save('regulations', regulationToSave);
	},

	saveRegulations: (regulations: Regulations[]) => {
		for (let aRegulation of regulations) {
			const regulationToSave = {
				id: aRegulation.id,
				owner: pb.authStore.record?.id,
				data: aRegulation
			};
			db.save('regulations', regulationToSave);
		}
	}
};
