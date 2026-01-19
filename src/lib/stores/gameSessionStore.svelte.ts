import { browser } from '$app/environment';

// On définit l'interface pour le typage TypeScript
export interface SessionSettings {
	id: string;
	locationName: string;
	weatherCondition: string;
	sessionBeginning: string;
	hasCrossAFixedPenalty: boolean;
	malusOverPar: number;
	malusValue: number;
	teamGame: boolean;
	playersPerTeam: number;
	usePenalizingGhost: boolean;
}

const STORAGE_KEY = 'golf-session_settings';

const defaultSettings: SessionSettings = {
	id: crypto.randomUUID(),
	locationName: 'La Doua',
	weatherCondition: 'Soleil',
	sessionBeginning: new Date().toISOString().split('T')[0],
	hasCrossAFixedPenalty: false,
	malusOverPar: 4,
	malusValue: 10,
	teamGame: false,
	playersPerTeam: 2,
	usePenalizingGhost: false
};

class GameSessionStore {
	// On initialise avec les valeurs par défaut
	settings = $state<SessionSettings>(defaultSettings);

	constructor() {
		if (browser) {
			const saved = localStorage.getItem(STORAGE_KEY);
			if (saved) {
				// On fusionne pour s'assurer que si tu ajoutes des nouveaux réglages
				// dans le futur, le store ne plante pas avec un vieux localStorage
				this.settings = { ...defaultSettings, ...JSON.parse(saved) };
			}

			// Sauvegarde automatique
			$effect.root(() => {
				$effect(() => {
					localStorage.setItem(STORAGE_KEY, JSON.stringify(this.settings));
				});
			});
		}
	}

	reset() {
		this.settings = { ...defaultSettings };
	}
}

export const sessionSettingsStore = new GameSessionStore();
