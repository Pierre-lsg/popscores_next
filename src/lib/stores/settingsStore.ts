import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// 1. Définir les valeurs par défaut
const defaultSettings = {
	clubName: 'Mon Club',
	useStableford: true,
	hcp: 54,
	darkMode: false
};

// 2. Récupérer les données du LocalStorage s'il y en a (uniquement côté client)
const initialSettings =
	browser && localStorage.getItem('app_settings')
		? JSON.parse(localStorage.getItem('app_settings') || '{}')
		: defaultSettings;

export const settings = writable(initialSettings);

// 3. Sauvegarder automatiquement dès que le store change
if (browser) {
	settings.subscribe((value) => {
		localStorage.setItem('app_settings', JSON.stringify(value));
	});
}
