import type { SessionArchive } from '$lib/types/sessionType';

const STORAGE_KEY = 'golf-history';

class HistoryStore {
	// La rune $state remplace le writable
	list = $state<SessionArchive[]>([]);

	constructor() {
		if (typeof window !== 'undefined') {
			// Chargement initial
			const saved = localStorage.getItem(STORAGE_KEY);
			this.list = saved ? JSON.parse(saved) : [];

			// Sauvegarde automatique avec $effect.root
			$effect.root(() => {
				$effect(() => {
					localStorage.setItem(STORAGE_KEY, JSON.stringify(this.list));
				});
			});
		}
	}

	/**
	 * Archive une nouvelle partie en haut de la liste
	 */
	archiveGame(historySession: SessionArchive): boolean {
		// If the game already exists in the list, remove it first
		this.list = this.list.filter((a) => a.id !== historySession.id);
		// Add the new game at the beginning of the list
		this.list = [historySession, ...this.list];
		return true;
	}

	/**
	 * Supprime une partie de l'historique par son index
	 */
	removeGame(id: string) {
		this.list = this.list.filter((a) => a.id !== id);
	}

	/**
	 * Vérifie si une partie existe dans l'historique
	 */
	isGameHistorized(id: string) {
		return this.list.some((session) => session.id === id);
	}

	/**
	 * Vide tout l'historique
	 */
	clear() {
		this.list = [];
	}
}

export const historyStore = new HistoryStore();
