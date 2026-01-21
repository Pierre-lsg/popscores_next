export type GameStatus = 'setup' | 'in_progress' | 'finished';

const KEY_STATUS = 'golf-game-status';
const KEY_TARGET = 'golf-current-target-index';

class GameStatusStore {
	// On utilise $state pour les deux valeurs
	status = $state<GameStatus>('setup');
	currentTargetIndex = $state<number>(0);

	constructor() {
		if (typeof window !== 'undefined') {
			// Chargement initial
			const savedStatus = localStorage.getItem(KEY_STATUS) as GameStatus;
			const savedTarget = localStorage.getItem(KEY_TARGET);

			this.status = savedStatus || 'setup';
			this.currentTargetIndex = savedTarget ? parseInt(savedTarget) : 0;

			// Effet racine pour sauvegarder automatiquement les changements
			$effect.root(() => {
				$effect(() => {
					localStorage.setItem(KEY_STATUS, this.status);
					localStorage.setItem(KEY_TARGET, this.currentTargetIndex.toString());
				});
			});
		}
	}

	// Méthode pour passer au cible suivante
	nextTarget() {
		this.currentTargetIndex++;
	}

	// Méthode pour revenir à la cible précédente
	prevTarget() {
		if (this.currentTargetIndex > 0) this.currentTargetIndex--;
	}

	// Méthode pour réinitialiser le jeu
	reset() {
		this.status = 'setup';
		this.currentTargetIndex = 0;
		localStorage.removeItem(KEY_STATUS);
		localStorage.removeItem(KEY_TARGET);
	}
}

export const gameStatus = new GameStatusStore();
