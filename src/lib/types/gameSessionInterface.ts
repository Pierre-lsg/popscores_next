import type { Weather } from '$lib/types/weatherInterface';
import type { Player } from '$lib/types/playerInterface';
import type { Target } from '$lib/types/targetsInterface';

export interface GameSession {
	id: string; // Un identifiant unique (ex: timestamp)
	date: string; // Date et heure de la partie
	location: Location;
	weather: Weather;
	players: Player[]; // La liste des joueurs avec leurs scores finaux
	targets: Target[]; // La configuration des trous (PARs) de cette partie
	isFinished: boolean; // Pour distinguer une partie en cours d'une archive
}
