import type { Hole } from '$lib/types/types';

export const getRelativeScore = (playerScores: number[], holes: Hole[]): number => {
	return playerScores.reduce((total, stroke, index) => {
		// Si le score n'est pas encore saisi (0), on ne compte rien
		if (stroke === 0) return total;

		const holePar = holes[index]?.par || 0;
		return total + (stroke - holePar);
	}, 0);
};

// On garde aussi le total brut pour l'affichage
export const getTotalStrokes = (scores: number[]) =>
	scores.reduce((a, b) => Number(a) + Number(b), 0);
