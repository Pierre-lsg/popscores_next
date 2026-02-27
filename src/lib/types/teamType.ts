// Exemple de structure dans ton store
export interface Team {
	id: string;
	name: string;
	playersId: string[];
	clubId: string;
	sessionId?: string; // null s'il s'agit d'une session non enregistrée (QuickSession)
}

export interface RankedTeam {
	rank: number;
	team: Team;
	totalScore: number;
	isTie: boolean;
}
