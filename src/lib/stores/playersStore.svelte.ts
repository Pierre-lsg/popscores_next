import type { Player } from '$lib/types/playerInterface';
import { teamsStore } from './teamsStore.svelte';

const STORAGE_KEY = 'golf-players-data';

class PlayersStore {
	// État de base (la liste brute)
	list = $state<Player[]>([]);

	unassignedPlayers = $derived(this.list.filter((player) => player.teamId === ''));

	assignedPlayers = $derived(this.list.filter((player) => player.teamId !== ''));

	constructor() {
		if (typeof window !== 'undefined') {
			const savedData = localStorage.getItem(STORAGE_KEY);
			if (savedData) {
				this.list = JSON.parse(savedData);
			}

			// Sauvegarde automatique dès que la liste (ou un élément de la liste) change
			$effect.root(() => {
				$effect(() => {
					console.log('Liste des joueurs', this.list.length);
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
		return team ? team.name : player.name;
	}

	getPlayerNameById(playerId: string) {
		const player = this.list.find((p) => p.id === playerId);
		return player ? player : { id: '', name: '', teamId: '', scores: {} };
	}

	assignPlayerToTeam(playerId: string, teamId: string) {
		const player = this.list.find((p) => p.id === playerId);
		if (player) {
			player.teamId = teamId;
		}
	}

	// --- Méthodes d'actions ---
	add(name: string) {
		this.list.push({
			id: crypto.randomUUID(),
			name,
			teamId: '', // Initialement vide
			scores: {}
		});
	}

	remove(id: string) {
		this.list = this.list.filter((p) => p.id !== id);
	}

	updateScore(playerId: string, targetId: string, value: number) {
		const player = this.list.find((p) => p.id === playerId);
		if (player) {
			// Svelte 5 détecte le changement dans l'objet interne
			player.scores[targetId] = value;
		}
	}

	cleanOrphanScores(activeTargetIds: string[]) {
		this.list.forEach((player) => {
			Object.keys(player.scores).forEach((targetId) => {
				if (!activeTargetIds.includes(targetId)) {
					delete player.scores[targetId];
				}
			});
		});
	}

	reset() {
		this.list = [];
		if (typeof window !== 'undefined') {
			localStorage.removeItem(STORAGE_KEY);
		}
	}
}

export const playersStore = new PlayersStore();
