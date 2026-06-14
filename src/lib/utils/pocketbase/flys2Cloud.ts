import type { Fly } from '$lib/types/flyType';
import { db, pb } from './pocketBase';

export const flyService = {
	getAll: () => db.getFullList<{ data: Fly }>('flys', { sort: 'created' }),

	getAllflys: async () => {
		const flys = await db.getFullList<{ data: Fly }>('flys', { sort: 'created' });
		return flys.map((fly) => fly.data) as Fly[];
	},

	getFlysByCompetition: async (competitionId: string) => {
		const flys = await db.getFullList<{ data: Fly }>('flys', { filter: `competition ~ "${competitionId}"` });
		return flys.map((fly) => fly.data) as Fly[];
	},

	getById: (id: string) => db.getOne('flys', id, {}),

	getFlyById: async (id: string) => {
		const fly = await db.getOne<{ data: Fly }>('flys', id, {});
		return fly?.data as Fly;
	},

	deleteFly: (id: string) => db.delete('flys', id),

	saveFly: async (aFly: Fly) => {
		const flyToSave = {
			id: aFly.id,
			competition: aFly.competitionId,
			owner: pb.authStore.record?.id,
			data: aFly
		};
		return await db.save('flys', flyToSave);
	},

	saveFlys: async (flys: Fly[]) => {
		const promises = flys.map((aFly) => {
			const flyToSave = {
				id: aFly.id,
				competition: aFly.competitionId,
				owner: pb.authStore.record?.id,
				data: aFly
			};
			return db.save('flys', flyToSave);
		});
		return await Promise.all(promises);
	}
};
