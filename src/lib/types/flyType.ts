export type CompetitionStatus = 'not_started' | 'in_progress' | 'finished' | 'validated';

export interface Fly {
	id: string;
	order: number;
	playersId: string[];
	teamsId: string[];
	status: CompetitionStatus;
	supervisorId: string; // id of an User
}
