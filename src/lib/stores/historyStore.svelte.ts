const STORAGE_KEY = 'golf_history';

class HistoryStore {
	// La rune $state remplace le writable
	list = $state<any[]>([]);

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
	archiveGame(gameData: any) {
		// En Svelte 5, on peut modifier le tableau directement.
		// On utilise un spread pour ajouter au début, ou .unshift()
		this.list = [gameData, ...this.list];
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
