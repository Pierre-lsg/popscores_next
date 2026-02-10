<script lang="ts">
	import type { Team } from '$lib/types/teamType';
	import type { Player } from '$lib/types/playerType';
	import { listTeamPlayer } from '$lib/utils/session/golfScoringFunction.svelte';

	interface Props {
		team: Team;
		players: Player[];
		playersPerTeam: number;
	}

	let { team, players, playersPerTeam }: Props = $props();
</script>

<div>
	{team.name} :
	{#each listTeamPlayer(team, players) as player, i}
		{#if i === 0}
			{player.name}
		{:else}
			, {player.name}
		{/if}
	{/each}

	{#if playersPerTeam !== team.playersId.length}
		<span>*incomplet</span>
	{/if}
</div>
