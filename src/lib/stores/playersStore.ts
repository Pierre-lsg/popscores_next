import { writable } from 'svelte/store';
import type { Player } from '$lib/types/types';

// Clé unique pour identifier nos données dans le navigateur
const STORAGE_KEY = 'golf-players-data';

function createPlayersStore() {
	const savedData = localStorage.getItem(STORAGE_KEY);
	const initialValue = savedData ? JSON.parse(savedData) : [];

	const { subscribe, set, update } = writable<Player[]>(initialValue);

	return {
		subscribe,

		save: (data: Player[]) => {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
		},

		add: (name: string, holeCount: number) =>
			update((players) => {
				const newList = [
					...players,
					{ id: crypto.randomUUID(), name, scores: Array(holeCount).fill(0) }
				];
				localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
				return newList;
			}),

		remove: (id: string) =>
			update((players) => {
				const newList = players.filter((p) => p.id !== id);
				localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
				return newList;
			}),

		syncAddHole: (par?: number) =>
			update((players) => {
				const newList = players.map((p) => ({
					...p,
					scores: [...p.scores, par || 0]
				}));
				localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
				return newList;
			}),

		syncRemoveHole: (index: number) =>
			update((players) => {
				const newList = players.map((p) => ({
					...p,
					scores: p.scores.filter((_, i) => i !== index)
				}));
				localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
				return newList;
			}),

		// Très important pour le bind:value direct dans les inputs !
		// Svelte appelle 'set' quand on utilise bind sur un élément du store
		set: (value: Player[]) => {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
			set(value);
		},

		reset: () => {
			localStorage.removeItem(STORAGE_KEY);
			set([]);
		}
	};
}

export const playersStore = createPlayersStore();
