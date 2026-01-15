import type { Player } from '$lib/types/playerInterface';
import type { Team } from '$lib/types/teamInterface';
import { playersStore } from '$lib/stores/playersStore.svelte';
import { targetsStore } from '$lib/stores/targetsStore.svelte';
import { teamsStore } from '$lib/stores/teamsStore.svelte';
import { sessionSettingsStore } from '$lib/stores/gameSessionStore.svelte';

const s = sessionSettingsStore.settings;

export interface RankedPlayer {
	rank: number;
	player: any;
	totalScore: number;
	isTie: boolean;
}

// Calcul du Par total du parcours
export const totalPar = targetsStore.list.reduce((sum, t) => sum + t.par, 0);

// Calcul des scores individuels
export const calculatePlayerScore = (player: Player) => {
	return targetsStore.list.reduce((sum, target) => {
		return sum + (player.scores[target.id] || 0);
	}, 0);
};

// Tri des joueurs par score total
const rankedPlayers = $derived(
	[...playersStore.list].sort((a, b) => {
		return calculatePlayerScore(a) - calculatePlayerScore(b);
	})
);

export const getRankedPlayers = (players: any[]): RankedPlayer[] => {
	// 1. On calcule les scores totaux et on trie
	const sorted = [...players]
		.map((p) => ({
			player: p,
			totalScore: calculatePlayerScore(p)
		}))
		.sort((a, b) => a.totalScore - b.totalScore);

	// 2. On attribue les rangs avec gestion des ex-aequo
	return sorted.map((entry, index, array) => {
		let rank = index + 1;
		let isTie = false;

		if (index > 0 && entry.totalScore === array[index - 1].totalScore) {
			// Si même score que le précédent, on cherche le rang du premier de la série
			let i = index;
			while (i > 0 && array[i].totalScore === array[i - 1].totalScore) {
				i--;
			}
			rank = i + 1;
			isTie = true;
		} else if (index < array.length - 1 && entry.totalScore === array[index + 1].totalScore) {
			isTie = true;
		}

		return {
			...entry,
			rank,
			isTie
		};
	});
};

// Score total par rapport au Par
export function getPlayerStats(player: Player) {
	const gross = calculatePlayerScore(player);
	const diff = gross - totalPar;
	const diffText = diff > 0 ? `(+${diff})` : diff < 0 ? `(${diff})` : '(E)';

	return { gross, diffText, diff };
}

// Liste des joueurs pour le podium
export const top3Players = rankedPlayers.slice(0, 3);
export const othersRankedPlayers = rankedPlayers.slice(3);

// --
// Calcul des scores par équipe
// --
// Score total de l'équipe
export const calculateTeamScore = (team: Team) => {
	// Pour toutes les cibles du parcours
	return targetsStore.list.reduce((sum, target) => {
		// 1. Récupération des scores réels présents
		const scores = team.playersId.map((id) => {
			const p = playersStore.list.find((p) => p.id === id);
			return p?.scores[target.id] || 0;
		});

		// 2. Injection des fantômes si l'équipe est incomplète
		while (scores.length < s.playersPerTeam) {
			let ghostValue: number;
			switch (target.rule) {
				case 'Bonus':
					ghostValue = 0;
					break;
				case 'Individuel':
					if (s.usePenalizingGhost) {
						if (s.hasCrossAFixedPenalty) ghostValue = s.malusValue;
						else ghostValue = target.par + s.malusOverPar;
					} else ghostValue = scores[0];
					break;
				default:
					ghostValue = scores[0];
					break;
			}
			scores.push(ghostValue);
		}

		// 3. Somme des scores de la cible pour l'équipe
		const targetTotal = scores.reduce((a, b) => a + b, 0);

		return sum + targetTotal;
	}, 0);
};

// Liste les joueurs de l'équipe
export const listTeamPlayer = (team: Team) => {
	// On mappe les IDs de l'équipe vers les objets joueurs du store
	return team.playersId
		.map((id) => {
			return playersStore.list.find((p) => p.id === id);
		})
		.filter((p) => p !== undefined); // Sécurité pour éviter les éléments vides
};

export const formatPlayerList = (players: Player[]) => {
	let names = players.map((p) => p.name);
	if (names.length < s.playersPerTeam) names.push('👻');

	// On crée le formateur pour le français
	const formatter = new Intl.ListFormat('fr', {
		style: 'long',
		type: 'conjunction'
	});

	return formatter.format(names);
};

// Score total par rapport au Par de l'équipe
export function getTeamStats(team: Team) {
	const gross = calculateTeamScore(team);
	const diff = gross - totalPar * s.playersPerTeam;
	const diffText = diff > 0 ? `(+${diff})` : diff < 0 ? `(${diff})` : '(E)';

	return { gross, diffText, diff };
}

// Classement : Trie les équipes par score total
export const rankedTeams = [...teamsStore.list].sort((a, b) => {
	return calculateTeamScore(a) - calculateTeamScore(b);
});

// Liste des équipes pour le podium
export const top3Teams = rankedTeams.slice(0, 3);
export const othersRankedTeams = rankedTeams.slice(3);
