<script lang="ts">
	import '$lib/styles/golfScoring.css';
	import type { Competition } from '$lib/types/competitionType';
	import type { Player, RankedPlayer } from '$lib/types/playerType';
	import type { Regulation } from '$lib/types/regulationsType';
	import type { ScoreCard } from '$lib/types/scoreCardType';
	import type { Target } from '$lib/types/targetType';
	import type { Team } from '$lib/types/teamType';
	import type { RankedTeam } from '$lib/types/teamType';

	import PlayerScoreCardByTarget from '$lib/components/core_game/PlayerScoreCardByTarget.svelte';
	import TeamScoreCardByTarget from '$lib/components/core_game/TeamScoreCardByTarget.svelte';
	import { scoreCardService } from '$lib/utils/pocketbase/scoreCards2Cloud';
	import { getRankedPlayers, getRankedTeams } from '$lib/utils/session/golfScoringFunction.svelte';
	import { onMount } from 'svelte';

	let { competition = null } = $props<{
		competition: Competition;
	}>();

	let allScoreCards: ScoreCard[] = $state([]);
	let rankedPlayers: RankedPlayer[] = $state([]);
	let rankedTeams: RankedTeam[] = $state([]);
	let targets: Target[] = $state([]);
	let players: Player[] = $state([]);
	let teams: Team[] = $state([]);
	let settings: Regulation = $state({} as Regulation);

	onMount(async () => {
		allScoreCards = await scoreCardService.getScoreCardByCompetition(competition.id);
		if (allScoreCards) {
			settings = allScoreCards[0].regulation;
			targets = allScoreCards[0].targets;
			allScoreCards.forEach((sc) => {
				players = [...players, ...sc.players];
				sc.rankedTeams.forEach((rt) => teams.push(rt.team));
			});
			rankedPlayers = getRankedPlayers(players, targets);
			rankedTeams = getRankedTeams(teams, targets, players, settings);
		}
	});
</script>

<div>
	{#if settings.teamGame}
		<TeamScoreCardByTarget {rankedTeams} {targets} {players} {settings} />
	{:else}
		<PlayerScoreCardByTarget {targets} {rankedPlayers} />
	{/if}
</div>
