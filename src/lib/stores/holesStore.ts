import { writable } from 'svelte/store';
import type { Hole } from '$lib/types/holesIntfc';

const STORAGE_KEY = 'golf-holes-data';

function createHolesStore() {
	const savedData = localStorage.getItem(STORAGE_KEY);
	const initialValue = savedData ? JSON.parse(savedData) : [];

	const { subscribe, update, set } = writable<Hole[]>(initialValue);

	return {
		subscribe,

		set: (value: Hole[]) => {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
			set(value);
		},

		add: (par: number, name: string, rule: string) =>
			update((holes) => {
				const newList = [...holes, { id: crypto.randomUUID(), par, name, rule }];
				localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
				return newList;
			}),

		updatePar: (index: number, newPar: number) =>
			update((holes) => {
				const newList = [...holes];
				newList[index] = { ...newList[index], par: Number(newPar) || 0 };
				localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
				return newList;
			}),

		remove: (index: number) =>
			update((holes) => {
				const newList = holes.filter((_, i) => i !== index);
				localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
				return newList;
			}),

		reset: () => {
			const defaultValue = [{ id: crypto.randomUUID(), par: 4 }];
			localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultValue));
			set(defaultValue);
		}
	};
}

export const holesStore = createHolesStore();
