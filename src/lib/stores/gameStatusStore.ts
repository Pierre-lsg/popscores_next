import { writable } from 'svelte/store';

export type GameStatus = 'setup' | 'in_progress' | 'finished';

const STORAGE_KEY = 'golf-game-status';

function createGameStatusStore() {
	const saved = localStorage.getItem(STORAGE_KEY) as GameStatus;
	const { subscribe, set } = writable<GameStatus>(saved || 'setup');

	return {
		subscribe,
		set: (status: GameStatus) => {
			localStorage.setItem(STORAGE_KEY, status);
			set(status);
		},
		reset: () => {
			localStorage.removeItem(STORAGE_KEY);
			set('setup');
		}
	};
}

export const gameStatus = createGameStatusStore();

const STORAGE_KEY_CURRENT_HOLE_INDEX = 'golf-current-hole-index';

function createCurrentHoleIndexStore() {
	const saved = localStorage.getItem(STORAGE_KEY_CURRENT_HOLE_INDEX);
	const { subscribe, set } = writable<number>(saved ? parseInt(saved) : 0);

	return {
		subscribe,
		set: (index: number) => {
			localStorage.setItem(STORAGE_KEY_CURRENT_HOLE_INDEX, index.toString());
			set(index);
		},
		reset: () => {
			localStorage.removeItem(STORAGE_KEY_CURRENT_HOLE_INDEX);
			set(0);
		}
	};
}

export const currentHoleIndex = createCurrentHoleIndexStore();
