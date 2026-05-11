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
	async getFullList<T>(collectionName: string, options = {}): Promise<T[]> {
		try {
			return await pb.collection(collectionName).getFullList<T>({
				sort: '-created',
				requestKey: null,
				...options
			});
		} catch (err) {
			console.error(`Erreur getFullList sur ${collectionName} :`, err);
			throw err;
		}
	},

	// Récupérer un record par id
	async getOne<T>(collectionName: string, id: string, options = {}): Promise<T | null> {
		try {
			return await pb.collection(collectionName).getOne<T>(id, { requestKey: null, ...options });
		} catch (err) {
			console.error(`Erreur getOne sur ${collectionName} :`, err);
			return null;
		}
	},

	// Supprimer un record
	async delete(collectionName: string, id: string): Promise<boolean> {
		try {
			return await pb.collection(collectionName).delete(id, { requestKey: null });
		} catch (err) {
			console.error(`Erreur delete sur ${collectionName} :`, err);
			throw err;
		}
	},

	// Créer un record
	async create<T>(collectionName: string, data: Partial<T>): Promise<T> {
		try {
			const options = { requestKey: null };
			return await pb.collection(collectionName).create<T>(data, options);
		} catch (err) {
			console.error(`Erreur create sur ${collectionName} :`, err);
			throw err;
		}
	},

	// Mettre à jour un record
	async update<T>(collectionName: string, data: Partial<T> & { id: string }): Promise<T> {
		try {
			const options = { requestKey: null };
			return await pb.collection(collectionName).update<T>(data.id, data, options);
		} catch (err) {
			console.error(`Erreur update sur ${collectionName} :`, err);
			throw err;
		}
	},

	// Sauvegarder (Créer ou Mettre à jour selon la présence en base)
	async save<T>(collectionName: string, data: Partial<T> & { id: string }): Promise<T> {
		if (!data.id) {
			throw new Error("L'ID doit être fourni par l'application.");
		}

		try {
			const options = { requestKey: null };
			const filter = `id="${data.id}"`;

			const existingItem = await pb.collection(collectionName).getList(1, 1, {
				filter: filter,
				...options
			});

			const existing = existingItem.items[0];

			if (existing) {
				return await pb.collection(collectionName).update<T>(data.id, data, options);
			} else {
				return await pb.collection(collectionName).create<T>(data, options);
			}
		} catch (error) {
			console.error(`Erreur lors de l'upsert sur ${collectionName}:`, error);
			throw error;
		}
	},

	// Sauvegarder avec Clé dynamique
	// data est Record<string, any> car on accède dynamiquement à data[key]
	async saveWithKey<T>(collectionName: string, data: Record<string, any>, keyFields: string): Promise<T> {
		try {
			const options = { requestKey: null };

			const keys = keyFields.split(',').map((k) => k.trim());
			const filter = keys.map((key) => `${key} = "${data[key]}"`).join(' && ');

			const existingList = await pb.collection(collectionName).getList(1, 1, {
				filter: filter,
				...options
			});

			const existing = existingList.items[0];

			if (existing) {
				return await pb.collection(collectionName).update<T>(existing.id, data, options);
			} else {
				return await pb.collection(collectionName).create<T>(data, options);
			}
		} catch (error) {
			console.error(`Erreur lors de l'upsert par clé sur ${collectionName}:`, error);
			throw error;
		}
	}
};
