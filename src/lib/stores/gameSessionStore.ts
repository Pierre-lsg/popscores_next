import { writable } from 'svelte/store';

export type GameStatus = 'setup' | 'in_progress' | 'finished';

const STORAGE_KEY = 'golf-session-status';

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
