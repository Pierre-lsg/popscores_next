export type CompetitionStatus = 'setup' | 'in_progress' | 'finished';
export type CompetitionAction =
	| 'setting'
	| 'course'
	| 'players'
	| 'starting'
	| 'scoring'
	| 'following'
	| 'greeting'
	| 'idle';
const KEY_STATUS = 'golf-competition-status';
const KEY_ACTION = 'golf-competition-action';
const KEY_TARGET = 'golf-competition-target-index';

class CompetitionStatusStore {
	// On utilise $state pour les deux valeurs
	status = $state<CompetitionStatus>('setup');
	action = $state<CompetitionAction>('idle');
	currentTargetIndex = $state<number>(0);

	constructor() {
		if (typeof window !== 'undefined') {
			// Chargement initial
			const savedStatus = localStorage.getItem(KEY_STATUS) as CompetitionStatus;
			const savedTarget = localStorage.getItem(KEY_TARGET);
			const savedAction = localStorage.getItem(KEY_ACTION) as CompetitionAction;

			this.status = savedStatus || 'setup';
			this.action = savedAction || 'idle';
			this.currentTargetIndex = savedTarget ? parseInt(savedTarget) : 0;

			// Effet racine pour sauvegarder automatiquement les changements
			$effect.root(() => {
				$effect(() => {
					localStorage.setItem(KEY_STATUS, this.status);
					localStorage.setItem(KEY_ACTION, this.action);
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
		this.action = 'idle';
		this.currentTargetIndex = 0;
		localStorage.removeItem(KEY_STATUS);
		localStorage.removeItem(KEY_TARGET);
		localStorage.removeItem(KEY_ACTION);
	}
}

export const competitionStatus = new CompetitionStatusStore();
