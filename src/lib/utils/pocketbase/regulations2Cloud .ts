import type { Regulations } from '$lib/types/regulationsType';
import { db, pb } from './pocketBase';

export const regulationService = {
	getAll: () => db.getFullList<{ data: Regulations }>('regulations', { sort: 'created' }),

	getAllRegulations: async () => {
		const regulations = await db.getFullList<{ data: Regulations }>('regulations', { sort: 'created' });
		return regulations.map((regulation) => regulation.data) as Regulations[];
	},

	getById: (id: string) => db.getOne('regulations', id, {}),

	getRegulationById: async (id: string) => {
		const regulation = await db.getOne('regulations', id, {});
		return regulation?.data;
	},

	saveRegulation: async (aRegulation: Regulations) => {
		const regulationToSave = {
			id: aRegulation.id,
			owner: pb.authStore.record?.id,
			data: aRegulation
		};
		return await db.save('regulations', regulationToSave);
	},

	saveRegulations: async (regulations: Regulations[]) => {
		const promises = regulations.map((aRegulation) => {
			const regulationToSave = {
				id: aRegulation.id,
				owner: pb.authStore.record?.id,
				data: aRegulation
			};
			return db.save('regulations', regulationToSave);
		});
		return await Promise.all(promises);
	}
};
