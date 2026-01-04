export type GameStatus = 'setup' | 'in_progress' | 'finished';

const KEY_STATUS = 'golf-game-status';
const KEY_HOLE = 'golf-current-hole-index';

class GameStatusStore {
	// On utilise $state pour les deux valeurs
	status = $state<GameStatus>('setup');
	currentHoleIndex = $state<number>(0);

	constructor() {
		if (typeof window !== 'undefined') {
			// Chargement initial
			const savedStatus = localStorage.getItem(KEY_STATUS) as GameStatus;
			const savedHole = localStorage.getItem(KEY_HOLE);

			this.status = savedStatus || 'setup';
			this.currentHoleIndex = savedHole ? parseInt(savedHole) : 0;

			// Effet racine pour sauvegarder automatiquement les changements
			$effect.root(() => {
				$effect(() => {
					localStorage.setItem(KEY_STATUS, this.status);
					localStorage.setItem(KEY_HOLE, this.currentHoleIndex.toString());
				});
			});
		}
	}

	// Méthodes pour modifier l'état
	nextHole() {
		this.currentHoleIndex++;
	}

	prevHole() {
		if (this.currentHoleIndex > 0) this.currentHoleIndex--;
	}

	reset() {
		this.status = 'setup';
		this.currentHoleIndex = 0;
		localStorage.removeItem(KEY_STATUS);
		localStorage.removeItem(KEY_HOLE);
	}
}

export const gameStatus = new GameStatusStore();
