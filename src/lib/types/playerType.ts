export interface Player {
	id: string;
	name: string;
	teamId: string;
	scores: Record<string, number>;
}

export interface RankedPlayer {
	rank: number;
	player: Player;
	totalScore: number;
	isTie: boolean;
}
