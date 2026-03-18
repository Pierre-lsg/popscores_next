import type { Club } from '$lib/types/clubType';
import { db, pb } from './pocketBase';

export const clubService = {
	getAll: () => db.getFullList('clubs', { sort: 'created' }),

	getAllClubs: async () => {
		const clubs = await db.getFullList('clubs', { sort: 'created' });
		return clubs.map((club) => club.data) as Club[];
	},

	getAllClubsOfChampionship: async (csId: string) => {
		const clubs = await db.getFullList('clubs', { filter: `championship ~ "${csId}"` });
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
		db.save('clubs', clubToSave);
	},

	saveClubs: (clubs: Club[]) => {
		for (let aClub of clubs) {
			const clubToSave = {
				id: aClub.id,
				name: aClub.name,
				championship: aClub.championshipId,
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
			championship: aClub.championshipId,
			owner: pb.authStore.record?.id,
			data: aClub
		};
		db.create('clubs', clubToSave);
	},

	updateClub: (aClub: Club) => {
		const clubToSave = {
			id: aClub.id,
			name: aClub.name,
			championship: aClub.championshipId,
			owner: pb.authStore.record?.id,
			data: aClub
		};
		db.update('clubs', clubToSave);
	}
};
