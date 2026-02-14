export interface Regulation {
	hasCrossAFixedPenalty: boolean;
	malusValue: number;
	malusOverPar: number;
	playersPerTeam: number;
	teamGame: boolean;
	usePenalizingGhost: boolean;
}

export interface Regulations {
	id: string;
	regulation: Regulation;
	teamsPerFly: number;
	playersPerFly: number;
}
