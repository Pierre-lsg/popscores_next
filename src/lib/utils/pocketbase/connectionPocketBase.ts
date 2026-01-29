import PocketBase from 'pocketbase';
import { appSettings } from '$lib/stores/settingsStore.svelte';

// L'URL de ta VM Debian (IP du Chromebook + port mappé)
const pb = new PocketBase(appSettings.values.cloudUrl);

/**
 * Check if a connection is established
 * If not create it
 */
export async function connect2PB(): Promise<PocketBase> {
	if (!pb.authStore.isValid) {
		try {
			const authData = await pb
				.collection('users')
				.authWithPassword(appSettings.values.cloudLogin, appSettings.values.cloudPassword);
			console.log(pb.authStore.isValid);
			console.log(pb.authStore.token);
			console.log(pb.authStore.record?.id);
		} catch (error) {
			console.error('Erreur à la connexion : ', error);
		}
	}
	return pb;
}
