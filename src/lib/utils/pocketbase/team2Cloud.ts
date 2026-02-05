import PocketBase from 'pocketbase';
import type { Team } from '$lib/types/teamType';
import { connect2PB } from './connectionPocketBase';

let pb: PocketBase = await connect2PB();

/**
 * Save a team object to the cloud database.
 * @param aTeam - The session to save.
 */
export async function saveTeam2Cloud(aTeam: Team, clubId: string): Promise<string> {
	let status: string = 'warning';
	let noTeamFound = false;
	// Check if the connection is valid
	if (pb.authStore.isValid) {
		// Check if the team already exist or if needed to create it
		try {
			const record = await pb.collection('teams').getFirstListItem(`id="${aTeam.id}"`);
		} catch (error) {
			noTeamFound = true;
		}
	} else {
		status = 'failure';
		console.log('No connection to PB. Trying to reconnect');
		pb = await connect2PB();
	}

	if (noTeamFound) {
		try {
			saveNewteam(aTeam, clubId);
			status = 'success';
		} catch (error) {
			status = 'failure';
			console.error('Erreur de sauvegarde:', error);
		}
	} else {
		updateteam(aTeam, clubId);
	}

	return status;
}

async function saveNewteam(cloudTeam: Team, clId: string) {
	const dataToSave = {
		id: cloudTeam.id,
		name: cloudTeam.name,
		club: clId,
		owner: pb.authStore.record?.id,
		data: cloudTeam
	};
	try {
		const record = await pb.collection('teams').create(dataToSave);
	} catch (err) {
		throw err;
	}
}

async function updateteam(cloudTeam: Team, csId: string) {
	const dataToSave = {
		name: cloudTeam.name,
		owner: pb.authStore.record?.id,
		championship: csId,
		data: cloudTeam
	};

	try {
		const record = await pb.collection('teams').update(cloudTeam.id, dataToSave);
	} catch (err) {
		throw err;
	}
}

/**
 * Retrieves all teams from Pocket Base.
 */
export async function getAllTeamsFromCloud(clId: string): Promise<Team[]> {
	let allTeams: Team[] = [];

	if (pb.authStore.isValid) {
		try {
			const record = await pb.collection('teams').getFullList({
				page: 1,
				perPage: 50,
				filter: `club="${clId}"`
			});
			console.log(record);
			record.forEach((e) => {
				if (e.data) allTeams.push(e.data as Team);
			});
		} catch (error) {
			console.error('Error retrieving all teams:', error);
		}
	}

	return allTeams;
}
