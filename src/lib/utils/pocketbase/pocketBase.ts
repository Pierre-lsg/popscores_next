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
			const options = { requestKey: null };
			return await pb.collection(collectionName).create(data, options);
		} catch (err) {
			console.error(`Erreur save sur ${collectionName} :`, err);
			throw err;
		}
	},

	// Mettre à jour un record
	async update(collectionName: string, data: any) {
		try {
			const options = { requestKey: null };
			return await pb.collection(collectionName).update(data.id, data, options);
		} catch (err) {
			console.error(`Erreur update sur ${collectionName} :`, err);
			throw err;
		}
	},

	// Sauvegarder
	async save(collectionName: string, data: any) {
		// On part du principe que data.id contient l'ID calculé par ton app
		if (!data.id) {
			throw new Error("L'ID doit être fourni par l'application.");
		}

		try {
			// Désactiver l'auto-annulation
			const options = { requestKey: null };

			// 1. On tente de récupérer l'enregistrement existant
			let existing = null;
			try {
				existing = await pb
					.collection(collectionName)
					.getOne(data.id, options)
					.catch(() => null);
			} catch (e) {
				// Si getOne échoue, c'est généralement un 404 (n'existe pas)
				existing = null;
			}

			// 2. Décision : Update si présent, Create si absent
			if (existing) {
				return await pb.collection(collectionName).update(data.id, data, options);
			} else {
				return await pb.collection(collectionName).create(data, options);
			}
		} catch (error) {
			console.error(`Erreur lors de l'upsert sur ${collectionName}:`, error);
			throw error;
		}
	},

	// Sauvegarder avec Clé
	async saveWithKey(collectionName: string, data: any, keyFields: string) {
		try {
			const options = { requestKey: null };

			// 1. Construction du filtre dynamique (ex: "competitionId='ID1' && playerId='ID2'")
			// On sépare la chaîne 'competitionId, playerId' en tableau
			const keys = keyFields.split(',').map((k) => k.trim());

			const filter = keys.map((key) => `${key} = "${data[key]}"`).join(' && ');

			// 2. Recherche de l'enregistrement existant avec ce filtre
			const existingList = await pb.collection(collectionName).getList(1, 1, {
				filter: filter,
				...options
			});

			const existing = existingList.items[0];

			// 3. Décision : Update (si trouvé) ou Create (si absent)
			if (existing) {
				// On utilise l'ID trouvé en base pour faire l'update
				return await pb.collection(collectionName).update(existing.id, data, options);
			} else {
				// Création d'un nouvel enregistrement
				return await pb.collection(collectionName).create(data, options);
			}
		} catch (error) {
			console.error(`Erreur lors de l'upsert par clé sur ${collectionName}:`, error);
			throw error;
		}
	}
};
