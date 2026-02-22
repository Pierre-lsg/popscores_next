import type { Team } from '$lib/types/teamType';
import { db, pb } from './pocketBase';

export const teamService = {
	getAll: () => db.getFullList('teams', { sort: 'created' }),

	getAllTeams: async () => {
		const teams = await db.getFullList('teams', { sort: 'created' });
		return teams.map((team) => team.data) as Team[];
	},

	getTeamsByClub: async (clubId: string) => {
		const teams = await db.getFullList('teams', { filter: `club ~ "${clubId}"` });
		return teams.map((team) => team.data) as Team[];
	},

	getById: (id: string) => db.getOne('teams', id, {}),

	saveTeam: (aTeam: Team) => {
		const teamToSave = {
			id: aTeam.id,
			name: aTeam.name,
			club: aTeam.clubId,
			owner: pb.authStore.record?.id,
			data: aTeam
		};
		db.save('teams', teamToSave);
	},

	saveTeams: (teams: Team[]) => {
		for (let aTeam of teams) {
			const teamToSave = {
				id: aTeam.id,
				name: aTeam.name,
				club: aTeam.clubId,
				owner: pb.authStore.record?.id,
				data: aTeam
			};
			db.save('teams', teamToSave);
		}
	},

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
