import type { Club } from '$lib/types/clubType';
import { db, pb } from './pocketBase';

export const clubService = {
	getAll: () => db.getFullList<{ data: Club }>('clubs', { sort: 'created' }),

	getAllClubs: async () => {
		const clubs = await db.getFullList<{ data: Club }>('clubs', { sort: 'created' });
		return clubs.map((club) => club.data) as Club[];
	},

	getAllClubsOfChampionship: async (csId: string) => {
		const clubs = await db.getFullList<{ data: Club }>('clubs', { filter: `championship ~ "${csId}"` });
		return clubs.map((club) => club.data) as Club[];
	},

	getById: (id: string) => db.getOne('clubs', id, {}),

	getClubById: async (id: string) => {
		const club = await db.getOne('clubs', id, {});
		return club?.data as Club;
	},

	saveClub: async (aClub: Club) => {
		const clubToSave = {
			id: aClub.id,
			name: aClub.name,
			championship: aClub.championshipId,
			owner: pb.authStore.record?.id,
			data: aClub
		};
		return await db.save('clubs', clubToSave);
	},

	saveClubs: async (clubs: Club[]) => {
		const promises = clubs.map((aClub) => {
			const clubToSave = {
				id: aClub.id,
				name: aClub.name,
				championship: aClub.championshipId,
				owner: pb.authStore.record?.id,
				data: aClub
			};
			return db.save('clubs', clubToSave);
		});
		return await Promise.all(promises);
	},

	createClub: async (aClub: Club) => {
		const clubToSave = {
			id: aClub.id,
			name: aClub.name,
			championship: aClub.championshipId,
			owner: pb.authStore.record?.id,
			data: aClub
		};
		return await db.create('clubs', clubToSave);
	},

	updateClub: async (aClub: Club) => {
		const clubToSave = {
			id: aClub.id,
			name: aClub.name,
			championship: aClub.championshipId,
			owner: pb.authStore.record?.id,
			data: aClub
		};
		return await db.update('clubs', clubToSave);
	}
};
