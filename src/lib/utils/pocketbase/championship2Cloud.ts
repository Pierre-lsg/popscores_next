import PocketBase from 'pocketbase';
import type { Championship, CloudChampionship } from '$lib/types/championshipType';
import type { MarkedPointScale } from '$lib/types/markedPointScaleType';
import { connect2PB } from './connectionPocketBase';

let pb: PocketBase = await connect2PB();

/**
 * Save a championship object to the cloud database.
 * @param aChampionship - The session to save.
 */
export async function saveChampionship2Cloud(
	aChampionship: Championship,
	idvScale: MarkedPointScale,
	cltScale: MarkedPointScale
): Promise<string> {
	let status: string = 'warning';
	let noChampionShipFound = false;
	let cloudChamp: CloudChampionship;
	// Check if the connection is valid
	if (pb.authStore.isValid) {
		// Check if the championship already exist or if needed to create it
		try {
			const record = await pb
				.collection('championships')
				.getFirstListItem(`id="${aChampionship.id}"`);
		} catch (error) {
			noChampionShipFound = true;
		}
	} else {
		status = 'failure';
		console.log('No connection to PB. Trying to reconnect');
		pb = await connect2PB();
	}

	cloudChamp = {
		id: aChampionship.id,
		name: aChampionship.name,
		season: aChampionship.season,
		location: aChampionship.location,
		individualScale: idvScale,
		collectiveScale: cltScale
	};

	if (noChampionShipFound) {
		try {
			saveNewChampionship(cloudChamp);
			status = 'success';
		} catch (error) {
			status = 'failure';
			console.error('Erreur de sauvegarde:', error);
		}
	} else {
		updateChampionship(cloudChamp);
	}

	return status;
}

async function saveNewChampionship(cloudChamp: CloudChampionship) {
	const dataToSave = {
		id: cloudChamp.id,
		name: cloudChamp.name, // Corrected the field name from 'location' to 'name'
		owner: pb.authStore.record?.id,
		data: cloudChamp
	};

	try {
		const record = await pb.collection('championships').create(dataToSave); // Corrected the collection name from 'sessions' to 'championships'
	} catch (err) {
		throw err;
	}
}

async function updateChampionship(cloudChamp: CloudChampionship) {
	const dataToSave = {
		name: cloudChamp.name,
		owner: pb.authStore.record?.id,
		data: cloudChamp
	};

	try {
		const record = await pb.collection('sessions').update(cloudChamp.id, dataToSave);
	} catch (err) {
		throw err;
	}
}

/**
 * Retrieves all sessions from Pocket Base.
 */
export async function getAllSessionsFromCloud(): Promise<Championship[]> {
	let allSessions: Championship[] = [];

	if (pb.authStore.isValid) {
		try {
			const record = await pb.collection('sessions').getFullList({
				page: 1,
				perPage: 50
				// filter: 'localId="8832ae3d-5b9a-484d-853a-a87a7237bb0a"'
			});
			console.log(record);
			record.forEach((e) => {
				if (e.data) allSessions.push(e.data as Championship);
			});
		} catch (error) {
			console.error('Error retrieving all sessions:', error);
		}
	}

	return allSessions;
}
