import type { Fly } from './flyType';
import type { Competition } from './competitionType';
import type { RankedTeam } from './teamType';
import type { Target } from './targetType';
import type { Regulation } from './regulationsType';
import type { Player, RankedPlayer } from './playerType';

// Exemple de structure dans ton store
export interface ScoreCard {
	competition: Competition;
	fly: Fly;
	rankedTeams: RankedTeam[];
	rankedPlayers: RankedPlayer[];
	targets: Target[];
	players: Player[];
	regulation: Regulation;
}
