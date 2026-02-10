export interface Competition {
	id: string;
	name: string;
	startDate?: string;
	scorePublicationDate?: string;
	location?: string;
	regulationsId?: string;
	courseId?: string;
	teamsId?: string[]; // Une équipe liste des joueurs
	playersId?: string[];
	flys?: string[]; // Un fly liste des équipes ou des joueurs suivant le mode de la compétition
}
