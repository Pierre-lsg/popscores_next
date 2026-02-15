import type { Player } from '$lib/types/playerType';
import { db, pb } from './pocketBase';

export const playerService = {
	getAll: () => db.getFullList('players', { sort: 'created' }),

	getById: (id: string) => db.getOne('players', id, {}),

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
