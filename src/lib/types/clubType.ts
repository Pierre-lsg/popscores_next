export interface Club {
	id: string;
	name: string;
	description: string;
	playersId: string[];
	teamsId: string[];
	isMember: boolean;
	championshipId: string;
}
