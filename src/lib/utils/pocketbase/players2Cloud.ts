import type { Player } from '$lib/types/playerType';
import { db, pb } from './pocketBase';

export const playerService = {
	getAll: () => db.getFullList<{ data: Player }>('players', { sort: 'created' }),

	getAllPlayers: async () => {
		const players = await db.getFullList<{ data: Player }>('players', { sort: 'created' });
		return players.map((player) => player.data) as Player[];
	},

	getPlayersByClub: async (clubId: string) => {
		const players = await db.getFullList<{ data: Player }>('players', { filter: `club ~ "${clubId}"` });
		return players.map((player) => player.data) as Player[];
	},

	getById: (id: string) => db.getOne('players', id, {}),

	getPlayerById: async (id: string) => {
		const player = await db.getOne('players', id, {});
		return player?.data as Player;
	},

	savePlayer: async (aPlayer: Player) => {
		const playerToSave = {
			id: aPlayer.id,
			name: aPlayer.name,
			club: aPlayer.clubId,
			owner: pb.authStore.record?.id,
			data: aPlayer
		};
		return await db.save('players', playerToSave);
	},

	createPlayer: async (aPlayer: Player) => {
		const playerToSave = {
			id: aPlayer.id,
			name: aPlayer.name,
			club: aPlayer.clubId,
			owner: pb.authStore.record?.id,
			data: aPlayer
		};
		return await db.create('players', playerToSave);
	},

	updatePlayer: async (aPlayer: Player) => {
		const playerToSave = {
			id: aPlayer.id,
			name: aPlayer.name,
			club: aPlayer.clubId,
			owner: pb.authStore.record?.id,
			data: aPlayer
		};
		return await db.update('players', playerToSave);
	}
};
