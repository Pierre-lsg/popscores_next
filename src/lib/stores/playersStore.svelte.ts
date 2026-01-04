import type { Player } from '$lib/types/playerIntfc';
import { teamsStore } from './teamsStore.svelte';

const STORAGE_KEY = 'golf-players-data';

class PlayersStore {
	// État de base (la liste brute)
	list = $state<Player[]>([]);

	constructor() {
		if (typeof window !== 'undefined') {
			const savedData = localStorage.getItem(STORAGE_KEY);
			if (savedData) {
				this.list = JSON.parse(savedData);
			}

			// Sauvegarde automatique dès que la liste (ou un élément de la liste) change
			$effect.root(() => {
				$effect(() => {
					localStorage.setItem(STORAGE_KEY, JSON.stringify(this.list));
				});
			});
		}
	}

	// --- La vue dérivée (Remplaçante de playersWithTeams) ---
	// Elle est recalculée automatiquement si this.list ou teamsStore.list changent
	get playersWithTeams() {
		return this.list.map((player) => {
			const team = teamsStore.list.find((t) => t.id === player.teamId);
			return {
				...player,
				teamName: team ? team.name : 'Individuel'
			};
		});
	}

	// Dans playersStore.svelte.ts
	// On ajoute une méthode simple pour récupérer le nom
	getTeamName(player: Player) {
		const team = teamsStore.list.find((t) => t.id === player.teamId);
		return team ? team.name : 'Individuel';
	}

	// --- Méthodes d'actions ---
	add(name: string, holeCount: number) {
		this.list.push({
			id: crypto.randomUUID(),
			name,
			teamId: '', // Initialement vide
			scores: Array(holeCount).fill(0)
		});
		console.log('Liste après ajout :', this.list.length);
	}

	remove(id: string) {
		this.list = this.list.filter((p) => p.id !== id);
	}

	syncAddHole(par: number = 0) {
		this.list.forEach((p) => p.scores.push(par));
	}

	syncRemoveHole(index: number) {
		this.list.forEach((p) => p.scores.splice(index, 1));
	}

	reset() {
		this.list = [];
		if (typeof window !== 'undefined') {
			localStorage.removeItem(STORAGE_KEY);
		}
	}
}

export const playersStore = new PlayersStore();
