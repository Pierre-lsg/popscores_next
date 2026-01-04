export interface Player {
	id: string;
	name: string;
	teamId: string;
	scores: number[]; // Index 0 = score pour le trou à l'index 0 du holesStore
}
