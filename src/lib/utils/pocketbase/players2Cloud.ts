import type { Player } from '$lib/types/playerType';
import { db, pb } from './pocketBase';

export const playerService = {
	getAll: () => db.getFullList('players', { sort: 'created' }),

	getAllPlayers: async () => {
		const players = await db.getFullList('players', { sort: 'created' });
		return players.map((player) => player.data) as Player[];
	},

	getPlayersByClub: async (clubId: string) => {
		const players = await db.getFullList('players', { filter: `club ~ "${clubId}"` });
		return players.map((player) => player.data) as Player[];
	},

	getById: (id: string) => db.getOne('players', id, {}),

	getPlayerById: async (id: string) => {
		const player = await db.getOne('players', id, {});
		return player?.data as Player;
	},

	savePlayer: (aPlayer: Player) => {
		const playerToSave = {
			id: aPlayer.id,
			name: aPlayer.name,
			club: aPlayer.clubId,
			owner: pb.authStore.record?.id,
			data: aPlayer
		};
		db.save('players', playerToSave);
	},

	createPlayer: (aPlayer: Player) => {
		const playerToSave = {
			id: aPlayer.id,
			name: aPlayer.name,
			club: aPlayer.clubId,
			owner: pb.authStore.record?.id,
			data: aPlayer
		};
		db.create('players', playerToSave);
	},

	updatePlayer: (aPlayer: Player) => {
		const playerToSave = {
			id: aPlayer.id,
			name: aPlayer.name,
			club: aPlayer.clubId,
			owner: pb.authStore.record?.id,
			data: aPlayer
		};
		db.update('players', playerToSave);
	}
};
