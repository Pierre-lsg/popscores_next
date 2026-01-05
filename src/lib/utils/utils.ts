import type { Target } from '$lib/types/targetsInterface';

export function getRelativeScore(playerScores: Record<string, number>, targets: Target[]): number {
	return targets.reduce((acc, target) => {
		const score = playerScores[target.id];
		if (!score) return acc; // Si pas de score saisi, on ignore
		return acc + (score - (target.par || 0));
	}, 0);
}

// On garde aussi le total brut pour l'affichage

export function getTotalStrokes(playerScores: Record<string, number>, targets: Target[]): number {
	return targets.reduce((acc, target) => {
		return acc + (playerScores[target.id] || 0);
	}, 0);
}
