import type { MarkedPointScale } from './markedPointScaleType';

export interface Championship {
	id: string;
	name: string;
	season: string;
	location: string;
	competitionsId: string[];
	individualScale: string;
	collectiveScale: string;
}

export interface CloudChampionship {
	id: string;
	name: string;
	season: string;
	location: string;
	individualScale: MarkedPointScale;
	collectiveScale: MarkedPointScale;
}
