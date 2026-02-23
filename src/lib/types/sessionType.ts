import type { SessionSettings } from '$lib/types/gameSessionType';
import type { Player } from '$lib/types/playerType';
import type { Team } from '$lib/types/teamType';
import type { Target } from '$lib/types/targetType';

export interface SessionArchive {
	id: string; // crypto.randomUUID() !
	settings: SessionSettings;
	targets: Target[]; // Copie locale des cibles
	teams: Team[]; // Structure des équipes
	players: Player[]; // Joueurs avec leurs scores inclus
}
