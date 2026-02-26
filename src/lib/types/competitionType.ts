export type CompetitionStatus = 'setup' | 'in_progress' | 'finished';
export type CompetitionStep =
	| 'settings'
	| 'course'
	| 'players'
	| 'starting'
	| 'scoring'
	| 'following'
	| 'greeting'
	| 'ranking'
	| 'welcome';

export interface Competition {
	id: string;
	name: string;
	startDate: string;
	scorePublicationDate: string;
	location: string;
	regulationsId: string;
	courseId?: string;
	teamsId: string[];
	playersId: string[];
	flysId: string[];
	clubsId: string[];
	status: CompetitionStatus;
	step: CompetitionStep;
}
