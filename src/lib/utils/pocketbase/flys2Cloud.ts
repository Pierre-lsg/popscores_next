import type { Fly } from '$lib/types/flyType';
import { db, pb } from './pocketBase';

export const flyService = {
	getAll: () => db.getFullList('flys', { sort: 'created' }),

	getAllflys: async () => {
		const flys = await db.getFullList('flys', { sort: 'created' });
		return flys.map((fly) => fly.data) as Fly[];
	},

	getFlysByCompetition: async (competitionId: string) => {
		const flys = await db.getFullList('flys', { filter: `competition ~ "${competitionId}"` });
		return flys.map((team) => team.data) as Fly[];
	},

	getById: (id: string) => db.getOne('flys', id, {}),

	getFlyById: async (id: string) => {
		const fly = await db.getOne('flys', id, {});
		return fly?.data as Fly;
	},

	saveFly: (aFly: Fly) => {
		const flyToSave = {
			id: aFly.id,
			competition: aFly.competitionId,
			owner: pb.authStore.record?.id,
			data: aFly
		};
		db.save('flys', flyToSave);
	},

	saveFlys: (flys: Fly[]) => {
		for (let aFly of flys) {
			const flyToSave = {
				id: aFly.id,
				competition: aFly.competitionId,
				owner: pb.authStore.record?.id,
				data: aFly
			};
			db.save('flys', flyToSave);
		}
	}
};
