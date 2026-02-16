export interface Player {
	id: string;
	name: string;
	surname: string;
	nickname: string;
	teamId: string;
	clubId?: string;
	scores: Record<string, number>;
	sessionId?: string; // null s'il s'agit d'une session non enregistrée (QuickSession)
}

export interface RankedPlayer {
	rank: number;
	player: Player;
	totalScore: number;
	isTie: boolean;
}
