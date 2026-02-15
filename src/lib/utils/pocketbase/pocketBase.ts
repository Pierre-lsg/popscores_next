import PocketBase from 'pocketbase';
import { appSettings } from '$lib/stores/settingsStore.svelte';
import { writable } from 'svelte/store';

export const pb = new PocketBase(appSettings.values.cloudUrl);

export const user = writable(pb.authStore.record);

pb.authStore.onChange((auth) => {
	console.log("Changement d'état auth", auth);
	user.set(pb.authStore.record);
});

export const db = {
	// Récupérer tous les éléments d'une collection
	async getFullList(collectionName: string, options = {}) {
		try {
			return await pb.collection(collectionName).getFullList({
				sort: '-created',
				...options
			});
		} catch (err) {
			console.error(`Erreur getFullList sur ${collectionName} :`, err);
			throw err;
		}
	},

	// Récupérer un record par id
	async getOne(collectionName: string, id: string, options = {}) {
		try {
			return await pb.collection(collectionName).getOne(id, options);
		} catch (err) {
			console.error(`Erreur getOne sur ${collectionName} :`, err);
			return null;
		}
	},

	// Créer un record
	async create(collectionName: string, data: any) {
		try {
			return await pb.collection(collectionName).create(data);
		} catch (err) {
			console.error(`Erreur save sur ${collectionName} :`, err);
			throw err;
		}
	},

	// Mettre à jour un record
	async update(collectionName: string, data: any) {
		try {
			return await pb.collection(collectionName).update(data.id, data);
		} catch (err) {
			console.error(`Erreur update sur ${collectionName} :`, err);
			throw err;
		}
	},

	async save(collectionName: string, data: any) {
		// On part du principe que data.id contient l'ID calculé par ton app
		if (!data.id) {
			throw new Error("L'ID doit être fourni par l'application.");
		}

		try {
			// 1. On tente de récupérer l'enregistrement existant
			let existing = null;
			try {
				existing = await pb.collection(collectionName).getOne(data.id);
			} catch (e) {
				// Si getOne échoue, c'est généralement un 404 (n'existe pas)
				existing = null;
			}

			// 2. Décision : Update si présent, Create si absent
			if (existing) {
				return await pb.collection(collectionName).update(data.id, data);
			} else {
				return await pb.collection(collectionName).create(data);
			}
		} catch (error) {
			console.error(`Erreur lors de l'upsert sur ${collectionName}:`, error);
			throw error;
		}
	}
};
