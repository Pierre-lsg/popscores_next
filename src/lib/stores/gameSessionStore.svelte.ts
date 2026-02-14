import { browser } from '$app/environment';
import type { Regulation } from '$lib/types/regulationsType';

// On définit l'interface pour le typage TypeScript
export interface SessionSettings {
	id: string;
	locationName: string;
	weatherCondition: string;
	sessionBeginning: string;
	regulation: Regulation;
}

const STORAGE_KEY = 'golf-session_settings';

const regulation: Regulation = {
	hasCrossAFixedPenalty: false,
	malusOverPar: 4,
	malusValue: 10,
	teamGame: false,
	playersPerTeam: 2,
	usePenalizingGhost: false
};

const defaultSettings: SessionSettings = {
	id: crypto.randomUUID(),
	locationName: 'La Doua',
	weatherCondition: 'Soleil',
	sessionBeginning: new Date().toISOString().split('T')[0],
	regulation: regulation
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

	/**
	 * Resets the game session settings to their default values.
	 */
	reset() {
		this.settings = { ...defaultSettings };
		this.settings.id = crypto.randomUUID();
	}
}

export const sessionSettingsStore = new GameSessionStore();
