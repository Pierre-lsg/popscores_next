import type { Club } from '$lib/types/clubType';
import { db, pb } from './pocketBase';

export const clubService = {
	getAll: () => db.getFullList('clubs', { sort: 'created' }),

	getById: (id: string) => db.getOne('clubs', id, {}),

	createClub: (aClub: Club) => {
		const clubToSave = {
			id: aClub.id,
			name: aClub.name,
			owner: pb.authStore.record?.id,
			data: aClub
		};
		db.create('clubs', clubToSave);
	},

	updateClub: (aClub: Club) => {
		const clubToSave = {
			id: aClub.id,
			name: aClub.name,
			owner: pb.authStore.record?.id,
			data: aClub
		};
		db.update('clubs', clubToSave);
	}
};
