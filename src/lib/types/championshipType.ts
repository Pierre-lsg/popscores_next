import type { MarkedPointScale } from './markedPointScaleType';

export type ChampionshipStatus = 'setup' | 'in_progress' | 'finished';

export interface Ranking {
	id: string;
	score: number;
	competitionsId: string[];
}

export interface Championship {
	id: string;
	name: string;
	description: string;
	season: string;
	location: string;
	competitionsId: string[];
	individualScale: string;
	collectiveScale: string;
	rankingClubs: Ranking[];
	rankingPlayers: Ranking[];
	status: ChampionshipStatus;
	maxScoringTeams: number;
	managersId: string[];
	cpManagersId: string[];
	supervisorsId: string[];
}

export interface CloudChampionship {
	id: string;
	name: string;
	season: string;
	location: string;
	individualScale: MarkedPointScale;
	collectiveScale: MarkedPointScale;
}
