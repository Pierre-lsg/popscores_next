import type { Weather } from '$lib/types/weatherIntfc';
import type { Player } from '$lib/types/playerIntfc';
import type { Hole } from '$lib/types/holesIntfc';

export interface GameSession {
	id: string; // Un identifiant unique (ex: timestamp)
	date: string; // Date et heure de la partie
	location: Location;
	weather: Weather;
	players: Player[]; // La liste des joueurs avec leurs scores finaux
	holes: Hole[]; // La configuration des trous (PARs) de cette partie
	isFinished: boolean; // Pour distinguer une partie en cours d'une archive
}
