import PocketBase from 'pocketbase';
import type { SessionArchive } from '$lib/types/sessionType';
import { connectToPB } from './pbConnection';

const pb: PocketBase = await connectToPB();

/**
 * Saves a session object to the cloud database.
 * @param mySession - The session to save.
 */
export async function saveSessionToPB(mySession: SessionArchive) {
	if (pb.authStore.isValid) {
		/* Checking if the session doesn't exist */
		try {
			const record = await pb.collection('sessions').getFirstListItem(`localId="${mySession.id}"`);
			console.log(record);
		} catch (error) {
			console.log('No record find : ', error);
			/* Saving if don't exist */
			const dataToSave = {
				localId: mySession.id,
				location: mySession.settings.locationName,
				date: mySession.settings.sessionBeginning,
				owner: pb.authStore.record?.id,
				data: mySession
			};

			try {
				const record = await pb.collection('sessions').create(dataToSave);
				console.log("Session sauvegardée avec l'ID:", record.id);
				return record;
			} catch (error) {
				console.error('Erreur de sauvegarde:', error);
			}
		}
	}
}

/**
 * Retrieves all sessions from Pocket Base.
 */
export async function getAllSessionsFromPB(): Promise<SessionArchive[]> {
	let allSessions: SessionArchive[] = [];

	if (pb.authStore.isValid) {
		try {
			const record = await pb.collection('sessions').getFullList({
				page: 1,
				perPage: 50
				// filter: 'localId="8832ae3d-5b9a-484d-853a-a87a7237bb0a"'
			});
			console.log(record);
			record.forEach((e) => {
				if (e.data) allSessions.push(e.data as SessionArchive);
			});
		} catch (error) {
			console.error('Error retrieving all sessions:', error);
		}
	}

	return allSessions;
}

// Todo :
// Export pocket base configs param
// Control if session hasn't be saved yet
//   by saving the distant record.id
//   or looking adding the local id in the session component
// Add new functions to load all sessions created by an user
// in this case, no update needed
// Allow to remove session story from pocketbase
// A rule in pocket base control the this :
// owner  @request.auth.id
// KISS
