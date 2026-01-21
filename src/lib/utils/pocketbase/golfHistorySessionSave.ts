import PocketBase from 'pocketbase';
import type { SessionArchive } from '$lib/types/sessionType';

// L'URL de ta VM Debian (IP du Chromebook + port mappé)
const pb = new PocketBase('http://192.168.1.143:8090');

/**
 * Saves a session object to the cloud database.
 * @param mySessionObject - The session object to save.
 */
export async function saveSessionToCloud(mySessionObject: SessionArchive) {
	const dataToSave = {
		location: mySessionObject.settings.locationName,
		date: mySessionObject.settings.sessionBeginning,
		owner: '5ar1v9xlh6hdxjz',
		data: mySessionObject
	};
	try {
		const record = await pb.collection('sessions').create(dataToSave);
		console.log("Session sauvegardée avec l'ID:", record.id);
		return record;
	} catch (error) {
		console.error('Erreur de sauvegarde:', error);
	}
}

// Todo :
// Export pocket base configs param
// Control if session hasb't be saved yet
//   by saving the distant record.id
//   or looking adding the local id in the session component
// Add new functions to load all sessions created by an user
// in this case, no update needed
// Allow to remove session story from pocketbase
// A rule in pocket base control the this :
// owner  @request.auth.id
// KISS
