<script lang="ts">
	import { sessionSettingsStore } from '$lib/stores/gameSessionStore.svelte';
	import { teamsStore } from '$lib/stores/teamsStore.svelte';
	import { playersStore } from '$lib/stores/playersStore.svelte';
	import { targetsStore } from '$lib/stores/targetsStore.svelte';

	import {
		getRankedPlayers,
		getRankedTeams
	} from '$lib/utils/streetGolfSession/golfScoringFunction.svelte';

	import TeamScoreCard from '$lib/ui/TeamScoreCard.svelte';
	import PlayerScoreCard from '$lib/ui/PlayerScoreCard.svelte';

	const s = sessionSettingsStore.settings;

	let isTeamGame: boolean = s.teamGame;
	let rankedTeams = getRankedTeams(teamsStore.list, targetsStore.list, playersStore.list, s);
	let rankedPlayers = getRankedPlayers(playersStore.list, targetsStore.list);
</script>

{#if isTeamGame}
	<!-- carte de score en équipe -->
	<h2>Classement par équipe</h2>

	<TeamScoreCard
		{rankedTeams}
		targets={targetsStore.list}
		players={playersStore.list}
		settings={s}
	/>
{/if}

<!-- carte de score en individuel -->
<h2>Classement individuel</h2>

<PlayerScoreCard {rankedPlayers} targets={targetsStore.list} />
