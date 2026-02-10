import type { Player } from '$lib/types/playerType';
import type { Team } from '$lib/types/teamType';

export const getFilteredPlayers = (
	allPlayers: Player[],
	clubFilt: string,
	playerFilt: String
): Player[] => {
	let tempFilteredList: Player[] = allPlayers;

	if (clubFilt !== '') {
		tempFilteredList = tempFilteredList.filter((player) => player.clubId === clubFilt);
	}

	if (playerFilt !== '') {
		tempFilteredList = tempFilteredList.filter((player) =>
			player.name.toLowerCase().includes(playerFilt.toLowerCase())
		);
	}

	return tempFilteredList;
};

export const getFilteredTeams = (allTeams: Team[], clubFilt: string, teamFilt: String): Team[] => {
	let tempFilteredList: Team[] = allTeams;

	if (clubFilt !== '') {
		tempFilteredList = tempFilteredList.filter((team) => team.clubId === clubFilt);
	}

	if (teamFilt !== '') {
		tempFilteredList = tempFilteredList.filter((team) =>
			team.name.toLowerCase().includes(teamFilt.toLowerCase())
		);
	}

	return tempFilteredList;
};
