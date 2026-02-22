import type { Target } from '$lib/types/targetsType';
import { db, pb } from './pocketBase';

export const targetService = {
	getAll: () => db.getFullList('targets', { sort: 'created' }),

	getAllTargets: async () => {
		const targets = await db.getFullList('targets', { sort: 'created' });
		return targets.map((target) => target.data) as Target[];
	},

	getById: (id: string) => db.getOne('targets', id, {}),

	getTargetById: async (id: string) => {
		const target = await db.getOne('targets', id, {});
		return target?.data;
	},

	saveTarget: (aTarget: Target) => {
		const targetToSave = {
			id: aTarget.id,
			name: aTarget.name,
			owner: pb.authStore.record?.id,
			data: aTarget
		};
		db.save('targets', targetToSave);
	},

	saveTargets: (targets: Target[]) => {
		for (let aTarget of targets) {
			const targetToSave = {
				id: aTarget.id,
				name: aTarget.name,
				owner: pb.authStore.record?.id,
				data: aTarget
			};
			db.save('targets', targetToSave);
		}
	}
};
