import type { Target } from '$lib/types/targetType';
import { db, pb } from './pocketBase';

export const targetService = {
	getAll: () => db.getFullList<{ data: Target }>('targets', { sort: 'created' }),

	getAllTargets: async () => {
		const targets = await db.getFullList<{ data: Target }>('targets', { sort: 'created' });
		return targets.map((target) => target.data) as Target[];
	},

	getById: (id: string) => db.getOne('targets', id, {}),

	getTargetById: async (id: string) => {
		const target = await db.getOne<{ data: Target }>('targets', id, {});
		return target?.data;
	},

	saveTarget: async (aTarget: Target) => {
		const targetToSave = {
			id: aTarget.id,
			name: aTarget.name,
			owner: pb.authStore.record?.id,
			data: aTarget
		};
		return await db.save('targets', targetToSave);
	},

	saveTargets: async (targets: Target[]) => {
		const promises = targets.map((aTarget) => {
			const targetToSave = {
				id: aTarget.id,
				name: aTarget.name,
				owner: pb.authStore.record?.id,
				data: aTarget
			};
			return db.save('targets', targetToSave);
		});
		return await Promise.all(promises);
	}
};
