import type { Club } from '$lib/types/clubType';
import { db, pb } from './pocketBase';

export const clubService = {
	getAll: () => db.getFullList('clubs', { sort: 'created' }),

	getAllClubs: async () => {
		const clubs = await db.getFullList('clubs', { sort: 'created' });
		return clubs.map((item) => ({
			id: item.id,
			name: item.name,
			description: item.data.description,
			playersId: item.data.playersId,
			teamsId: item.data.teamsId
		})) as Club[];
	},

	getById: (id: string) => db.getOne('clubs', id, {}),

	saveClub: (aClub: Club) => {
		const clubToSave = {
			id: aClub.id,
			name: aClub.name,
			owner: pb.authStore.record?.id,
			data: aClub
		};
		db.save('clubs', clubToSave);
	},

	saveClubs: (clubs: Club[]) => {
		for (let aClub of clubs) {
			const clubToSave = {
				id: aClub.id,
				name: aClub.name,
				owner: pb.authStore.record?.id,
				data: aClub
			};
			db.save('clubs', clubToSave);
		}
	},

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
