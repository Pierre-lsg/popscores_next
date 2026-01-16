// Exemple de structure dans ton store
export interface Team {
	id: string;
	name: string;
	playersId: string[];
}

export interface RankedTeam {
	rank: number;
	team: Team;
	totalScore: number;
	isTie: boolean;
}
