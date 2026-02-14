import type { Regulation } from './regulationsType';

export interface SessionSettings {
	locationName: string;
	weatherCondition: string;
	sessionBeginning: string;
	regulation: Regulation;
}
