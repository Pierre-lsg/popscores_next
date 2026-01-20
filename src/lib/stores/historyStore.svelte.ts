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
	archiveGame(historySession: SessionArchive) {
		// Si la partie existe déjà, on la retire d'abord
		this.list = this.list.filter((a) => a.id !== historySession.id);
		// On ajoute l'archive en début de liste
		this.list = [historySession, ...this.list];
	}

	/**
	 * Supprime une partie de l'historique
	 */
	removeGame(index: number) {
		this.list.splice(index, 1);
	}

	/**
	 * Vide tout l'historique
	 */
	clear() {
		this.list = [];
	}
}

export const historyStore = new HistoryStore();
