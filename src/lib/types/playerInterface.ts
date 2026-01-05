export interface Player {
	id: string;
	name: string;
	teamId: string;
	scores: Record<string, number>;
}
