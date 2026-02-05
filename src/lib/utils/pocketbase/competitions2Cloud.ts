import PocketBase from 'pocketbase';
import type { Competition } from '$lib/types/competitionType';
import { connect2PB } from './connectionPocketBase';

let pb: PocketBase = await connect2PB();

/**
 * Save a competition object to the cloud database.
 * @param aCompetition - The session to save.
 */
export async function saveCompetition2Cloud(
	aCompetition: Competition,
	championshipId: string
): Promise<string> {
	let status: string = 'warning';
	let noCompetitionFound = false;
	// Check if the connection is valid
	if (pb.authStore.isValid) {
		// Check if the competition already exist or if needed to create it
		try {
			const record = await pb
				.collection('competitions')
				.getFirstListItem(`id="${aCompetition.id}"`);
		} catch (error) {
			noCompetitionFound = true;
		}
	} else {
		status = 'failure';
		console.log('No connection to PB. Trying to reconnect');
		pb = await connect2PB();
	}

	if (noCompetitionFound) {
		try {
			saveNewCompetition(aCompetition, championshipId);
			status = 'success';
		} catch (error) {
			status = 'failure';
			console.error('Erreur de sauvegarde:', error);
		}
	} else {
		updateCompetition(aCompetition, championshipId);
	}

	return status;
}

async function saveNewCompetition(cloudCompetition: Competition, csId: string) {
	const dataToSave = {
		id: cloudCompetition.id,
		name: cloudCompetition.name,
		owner: pb.authStore.record?.id,
		championship: csId,
		data: cloudCompetition
	};

	try {
		const record = await pb.collection('competitions').create(dataToSave);
	} catch (err) {
		throw err;
	}
}

async function updateCompetition(cloudCompetition: Competition, csId: string) {
	const dataToSave = {
		name: cloudCompetition.name,
		owner: pb.authStore.record?.id,
		championship: csId,
		data: cloudCompetition
	};

	try {
		const record = await pb.collection('competitions').update(cloudCompetition.id, dataToSave);
	} catch (err) {
		throw err;
	}
}

/**
 * Retrieves all competitions from Pocket Base.
 */
export async function getAllCompetitionsFromCloud(csId: string): Promise<Competition[]> {
	let allCompetitions: Competition[] = [];

	if (pb.authStore.isValid) {
		try {
			const record = await pb.collection('competitions').getFullList({
				page: 1,
				perPage: 50,
				filter: 'championship="' + csId.trim() + '"'
			});
			console.log(record);
			record.forEach((e) => {
				if (e.data) allCompetitions.push(e.data as Competition);
			});
		} catch (error) {
			console.error('Error retrieving all competitions:', error);
		}
	}

	return allCompetitions;
}
