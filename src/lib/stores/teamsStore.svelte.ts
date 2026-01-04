// import { browse } from '$app/environment';
import type { Team } from '$lib/types/teamIntfc';

const STORAGE_KEY = 'golf-teams-data';

// On utilise une classe pour encapsuler l'état et les méthodes
class TeamsStore {
	// La rune $state rend le tableau réactif
	// On initialise avec le localStorage si on est dans le navigateur
	list = $state<Team[]>([]);

	constructor() {
		if (typeof window !== 'undefined') {
			const savedData = localStorage.getItem(STORAGE_KEY);
			if (savedData) {
				this.list = JSON.parse(savedData);
			}

			// La rune $effect surveille 'this.list'
			// Dès qu'elle change, elle sauvegarde automatiquement
			$effect.root(() => {
				$effect(() => {
					localStorage.setItem(STORAGE_KEY, JSON.stringify(this.list));
				});
			});
		}
	}

	// Plus besoin d'utiliser .update(), on manipule le tableau directement
	add(id: string, name: string, membersId: string[]) {
		this.list.push({ id, name, membersId });
	}

	remove(id: string) {
		this.list = this.list.filter((t) => t.id !== id);
	}

	reset() {
		this.list = [];
		if (typeof window !== 'undefined') {
			localStorage.removeItem(STORAGE_KEY);
		}
	}
}

// On exporte une instance unique (Singleton)
export const teamsStore = new TeamsStore();
