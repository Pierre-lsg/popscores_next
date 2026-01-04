import { browser } from '$app/environment';

export interface AppSettings {
	clubName: string;
	useStableford: boolean;
	hcp: number;
	darkMode: boolean;
	hasCrossAFixedPenalty: boolean;
	malusValue: number;
	malusOverPar: number;
	isTeamGame: boolean;
}

const STORAGE_KEY = 'app_settings';

const defaultSettings: AppSettings = {
	clubName: 'Mon Club',
	useStableford: true,
	hcp: 54,
	darkMode: false,
	hasCrossAFixedPenalty: false,
	malusValue: 10,
	malusOverPar: 4,
	isTeamGame: false
};

class SettingsStore {
	// Un seul objet réactif pour tous les réglages
	values = $state<AppSettings>(defaultSettings);

	constructor() {
		if (browser) {
			const saved = localStorage.getItem(STORAGE_KEY);
			if (saved) {
				// Fusion pour gérer les futures mises à jour de l'app
				this.values = { ...defaultSettings, ...JSON.parse(saved) };
			}

			// Sauvegarde automatique globale
			$effect.root(() => {
				$effect(() => {
					localStorage.setItem(STORAGE_KEY, JSON.stringify(this.values));

					// Petit bonus : appliquer le dark mode au body automatiquement
					if (this.values.darkMode) {
						document.body.classList.add('dark');
					} else {
						document.body.classList.remove('dark');
					}
				});
			});
		}
	}

	reset() {
		this.values = { ...defaultSettings };
	}
}

export const appSettings = new SettingsStore();
