import PocketBase from 'pocketbase';
import type { Club } from '$lib/types/clubType';
import { connect2PB } from './connectionPocketBase';

let pb: PocketBase = await connect2PB();

/**
 * Save a club object to the cloud database.
 * @param aClub - The session to save.
 */
export const saveClub2Cloud = async (aClub: Club, championshipId: string): Promise<string> => {
	let status: string = 'warning';
	let noClubFound = false;
	// Check if the connection is valid
	if (pb.authStore.isValid) {
		// Check if the club already exist or if needed to create it
		try {
			const record = await pb.collection('clubs').getFirstListItem(`id="${aClub.id}"`);
		} catch (error) {
			noClubFound = true;
		}
	} else {
		status = 'failure';
		console.log('No connection to PB. Trying to reconnect');
		pb = await connect2PB();
	}

	if (noClubFound) {
		try {
			saveNewClub(aClub, championshipId);
			status = 'success';
		} catch (error) {
			status = 'failure';
			console.error('Erreur de sauvegarde:', error);
		}
	} else {
		updateClub(aClub, championshipId);
	}

	return status;
};

const saveNewClub = async (cloudClub: Club, csId: string) => {
	const dataToSave = {
		id: cloudClub.id,
		name: cloudClub.name,
		owner: pb.authStore.record?.id,
		championship: csId,
		data: cloudClub
	};

	console.log('data2Save', dataToSave);
	try {
		const record = await pb.collection('clubs').create(dataToSave);
	} catch (err) {
		throw err;
	}
};

const updateClub = async (cloudClub: Club, csId: string) => {
	const dataToSave = {
		name: cloudClub.name,
		owner: pb.authStore.record?.id,
		championship: csId,
		data: cloudClub
	};

	try {
		const record = await pb.collection('clubs').update(cloudClub.id, dataToSave);
	} catch (err) {
		throw err;
	}
};

/**
 * Retrieves all clubs from Pocket Base.
 */
export const getAllClubsFromCloud = async (csId: string): Promise<Club[]> => {
	let allClubs: Club[] = [];

	if (pb.authStore.isValid) {
		try {
			const record = await pb.collection('clubs').getFullList({
				page: 1,
				perPage: 50,
				filter: `championship ~ "${csId}"`
			});
			console.log(record);
			record.forEach((e) => {
				if (e.data) allClubs.push(e.data as Club);
			});
		} catch (error) {
			console.error('Error retrieving all clubs:', error);
		}
	}

	return allClubs;
};
