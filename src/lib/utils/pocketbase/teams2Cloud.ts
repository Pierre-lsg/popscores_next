import type { Team } from '$lib/types/teamType';
import { db, pb } from './pocketBase';

export const teamService = {
	getAll: () => db.getFullList('teams', { sort: 'created' }),

	getById: (id: string) => db.getOne('teams', id, {}),

	createTeam: (aTeam: Team) => {
		const teamToSave = {
			id: aTeam.id,
			name: aTeam.name,
			club: aTeam.clubId,
			owner: pb.authStore.record?.id,
			data: aTeam
		};
		db.create('teams', teamToSave);
	},

	updateTeam: (aTeam: Team) => {
		const teamToSave = {
			id: aTeam.id,
			name: aTeam.name,
			club: aTeam.clubId,
			owner: pb.authStore.record?.id,
			data: aTeam
		};
		db.update('teams', teamToSave);
	}
};
