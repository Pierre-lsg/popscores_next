import { browser } from '$app/environment';

/**
 * Interface for application settings.
 */
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

/**
 * Key used to store settings in local storage.
 */
const STORAGE_KEY = 'app_settings';

/**
 * Default application settings.
 */
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

/**
 * Class for managing application settings.
 */
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

	/**
	 * Resets settings to default.
	 */
	reset() {
		this.values = { ...defaultSettings };
	}
}

/**
 * Instance of SettingsStore for managing application settings.
 */
export const appSettings = new SettingsStore();
