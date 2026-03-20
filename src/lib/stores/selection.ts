import { page } from '$app/state';
import { championshipStore } from './championship/championshipsStore.svelte';

// On crée un objet réactif simple au lieu d'un store derived
export const selection = {
	// Getter pour l'ID (récupéré depuis l'URL ou les params)
	get currentId() {
		// Si tu utilises [id], utilise page.params.id
		// Si tu utilises ?id=, utilise page.url.searchParams.get('id')
		return page.params.id || page.url.searchParams.get('id');
	},

	// Getter pour le championnat complet
	get currentChampionship() {
		const id = this.currentId;
		if (!id) return null;

		// On cherche dans ton store Svelte 5 (qui doit être une rune $state)
		return championshipStore.list.find((c) => c.id === id) || null;
	}
};
