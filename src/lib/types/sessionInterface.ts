import type { SessionSettings } from "$lib/types/gameSessionInterface";
import type { Player } from "$lib/types/playerInterface";
import type { Team } from "$lib/types/teamInterface";
import type { Target } from "$lib/types/targetsInterface";

export interface SessionArchive {
    id: string; // crypto.randomUUID() !
    settings: SessionSettings;
    targets: Target[]; // Copie locale des cibles
    teams: Team[];     // Structure des équipes
    players: Player[]; // Joueurs avec leurs scores inclus
}