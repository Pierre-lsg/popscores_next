import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// 1. Définir les valeurs par défaut
const defaultSettings = {
	locationName: 'La Doua',
	weatherCondition: 'Soleil',
	hasCrossAFixedPenalty: false,
	malusOverPar: 4,
	malusValue: 10,
	teamGame: false,
	playersPerTeam: 2
};

// 2. Récupérer les données du LocalStorage s'il y en a (uniquement côté client)
const initialSettings =
	browser && localStorage.getItem('golf-session_settings')
		? JSON.parse(localStorage.getItem('golf-session_settings') || '{}')
		: defaultSettings;

export const sessionSettings = writable(initialSettings);

// 3. Sauvegarder automatiquement dès que le store change
if (browser) {
	sessionSettings.subscribe((value) => {
		localStorage.setItem('golf-session_settings', JSON.stringify(value));
	});
}
