import type { Team } from '$lib/types/teamType';
import { db, pb } from './pocketBase';

export const teamService = {
	getAll: () => db.getFullList<{ data: Team }>('teams', { sort: 'created' }),

	getAllTeams: async () => {
		const teams = await db.getFullList<{ data: Team }>('teams', { sort: 'created' });
		return teams.map((team) => team.data) as Team[];
	},

	getTeamsByClub: async (clubId: string) => {
		const teams = await db.getFullList<{ data: Team }>('teams', { filter: `club ~ "${clubId}"` });
		return teams.map((team) => team.data) as Team[];
	},

	getById: (id: string) => db.getOne('teams', id, {}),

	getTeamById: async (id: string) => {
		const team = await db.getOne<{ data: Team }>('teams', id, {});
		return team?.data as Team;
	},

	getTeamCompetitionById: async (id: string) => {
		const team = await db.getOne<{ data: Team }>('teams_in_competition', id, {});
		return team?.data as Team;
	},

	saveTeam: async (aTeam: Team) => {
		const teamToSave = {
			id: aTeam.id,
			name: aTeam.name,
			club: aTeam.clubId,
			owner: pb.authStore.record?.id,
			data: aTeam
		};
		return await db.save('teams', teamToSave);
	},

	saveCompetitionTeam: async (aTeam: Team) => {
		const teamToSave = {
			id: aTeam.id,
			name: aTeam.name,
			competition: aTeam.sessionId,
			owner: pb.authStore.record?.id,
			data: aTeam
		};
		return await db.save('teams_in_competition', teamToSave);
	},

	saveTeams: async (teams: Team[]) => {
		const promises = teams.map((aTeam) => {
			const teamToSave = {
				id: aTeam.id,
				name: aTeam.name,
				club: aTeam.clubId,
				owner: pb.authStore.record?.id,
				data: aTeam
			};
			return db.save('teams', teamToSave);
		});
		return await Promise.all(promises);
	},

	createTeam: async (aTeam: Team) => {
		const teamToSave = {
			id: aTeam.id,
			name: aTeam.name,
			club: aTeam.clubId,
			owner: pb.authStore.record?.id,
			data: aTeam
		};
		return await db.create('teams', teamToSave);
	},

	updateTeam: async (aTeam: Team) => {
		const teamToSave = {
			id: aTeam.id,
			name: aTeam.name,
			club: aTeam.clubId,
			owner: pb.authStore.record?.id,
			data: aTeam
		};
		return await db.update('teams', teamToSave);
	}
};
