import PocketBase from 'pocketbase';
import type { Player } from '$lib/types/playerType';
import { connect2PB } from './connectionPocketBase';

let pb: PocketBase = await connect2PB();

/**
 * Save a player object to the cloud database.
 * @param aPlayer - The session to save.
 */
export const savePlayer2Cloud = async (aPlayer: Player, clubId: string): Promise<string> => {
	let status: string = 'warning';
	let noPlayerFound = false;
	// Check if the connection is valid
	if (pb.authStore.isValid) {
		// Check if the Player already exist or if needed to create it
		try {
			const record = await pb.collection('players').getFirstListItem(`id="${aPlayer.id}"`);
		} catch (error) {
			noPlayerFound = true;
		}
	} else {
		status = 'failure';
		console.log('No connection to PB. Trying to reconnect');
		pb = await connect2PB();
	}

	if (noPlayerFound) {
		try {
			saveNewPlayer(aPlayer, clubId);
			status = 'success';
		} catch (error) {
			status = 'failure';
			console.error('Erreur de sauvegarde:', error);
		}
	} else {
		updatePlayer(aPlayer, clubId);
	}

	return status;
};

const saveNewPlayer = async (cloudPlayer: Player, clId: string) => {
	const dataToSave = {
		id: cloudPlayer.id,
		name: cloudPlayer.name,
		club: clId,
		owner: pb.authStore.record?.id,
		data: cloudPlayer
	};
	try {
		const record = await pb.collection('players').create(dataToSave);
	} catch (err) {
		throw err;
	}
};

const updatePlayer = async (cloudPlayer: Player, csId: string) => {
	const dataToSave = {
		name: cloudPlayer.name,
		owner: pb.authStore.record?.id,
		championship: csId,
		data: cloudPlayer
	};

	try {
		const record = await pb.collection('players').update(cloudPlayer.id, dataToSave);
	} catch (err) {
		throw err;
	}
};

/**
 * Retrieves all players from Pocket Base.
 */
export const getAllPlayersFromCloud = async (clId: string): Promise<Player[]> => {
	let allPlayers: Player[] = [];

	if (pb.authStore.isValid) {
		try {
			const record = await pb.collection('players').getFullList({
				page: 1,
				perPage: 50,
				filter: `club="${clId}"`
			});
			console.log(record);
			record.forEach((e) => {
				if (e.data) allPlayers.push(e.data as Player);
			});
		} catch (error) {
			console.error('Error retrieving all players:', error);
		}
	}

	return allPlayers;
};
