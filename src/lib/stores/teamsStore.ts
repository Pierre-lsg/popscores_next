import { writable } from 'svelte/store';
import type { Team } from '$lib/types/types';

// Clé unique pour identifier nos données dans le navigateur
const STORAGE_KEY = 'golf-teams-data';

function createTeamsStore() {
	const savedData = localStorage.getItem(STORAGE_KEY);
	const initialValue = savedData ? JSON.parse(savedData) : [];

	const { subscribe, set, update } = writable<Team[]>(initialValue);

	return {
		subscribe,

		save: (data: Team[]) => {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
		},

		add: (name: string, membersId: string[]) =>
			update((teams) => {
				const newList = [...teams, { id: crypto.randomUUID(), name, membersId }];
				localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
				return newList;
			}),

		remove: (id: string) =>
			update((teams) => {
				const newList = teams.filter((t) => t.id !== id);
				localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
				return newList;
			}),

		set: (value: Team[]) => {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
			set(value);
		},

		reset: () => {
			localStorage.removeItem(STORAGE_KEY);
			set([]);
		}
	};
}

export const teamsStore = createTeamsStore();
