<script lang="ts">
	import { sessionSettingsStore } from '$lib/stores/gameSessionStore.svelte';
	import { teamsStore } from '$lib/stores/quickSession/teamsStore.svelte';
	import { playersStore } from '$lib/stores/quickSession/playersStore.svelte';
	import { targetsStore } from '$lib/stores/quickSession/targetsStore.svelte';

	import { getRankedPlayers, getRankedTeams } from '$lib/utils/session/golfScoringFunction.svelte';

	import TeamScoreCard from '$lib/components/core_game/TeamScoreCard.svelte';
	import PlayerScoreCard from '$lib/components/core_game/PlayerScoreCard.svelte';
	import TeamScoreCardByTarget from '$lib/components/core_game/TeamScoreCardByTarget.svelte';
	import PlayerScoreCardByTarget from '$lib/components/core_game/PlayerScoreCardByTarget.svelte';

	const s = sessionSettingsStore.settings;

	let isTeamGame: boolean = s.regulation.teamGame;
	let rotateSCTeam: boolean = false;
	let rotateSCPlayer: boolean = false;
	let rankedTeams = getRankedTeams(
		teamsStore.list,
		targetsStore.list,
		playersStore.list,
		s.regulation
	);
	let rankedPlayers = getRankedPlayers(playersStore.list, targetsStore.list);
</script>

{#if isTeamGame}
	<!-- carte de score en équipe -->
	<h2>
		Classement par équipe <span role="none" onclick={() => (rotateSCTeam = !rotateSCTeam)}>🔄</span>
	</h2>

	{#if rotateSCTeam}
		<TeamScoreCardByTarget
			{rankedTeams}
			targets={targetsStore.list}
			players={playersStore.list}
			settings={s.regulation}
		/>
	{:else}
		<TeamScoreCard
			{rankedTeams}
			targets={targetsStore.list}
			players={playersStore.list}
			settings={s.regulation}
		/>
	{/if}
{/if}

<!-- carte de score en individuel -->
<h2>
	Classement individuel <span role="none" onclick={() => (rotateSCPlayer = !rotateSCPlayer)}
		>🔄</span
	>
</h2>

{#if rotateSCPlayer}
	<PlayerScoreCard {rankedPlayers} targets={targetsStore.list} />
{:else}
	<PlayerScoreCardByTarget {rankedPlayers} targets={targetsStore.list} />
{/if}
