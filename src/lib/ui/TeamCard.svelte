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
	let checkTeam: string = $derived(playersPerTeam !== team.playersId.length ? 'check-team' : '');
</script>

<div class={checkTeam}>
	{team.name} :
	{#each listTeamPlayer(team, players) as player, i}
		{#if i === 0}
			{player.name}
		{:else}
			, {player.name}
		{/if}
	{/each}
</div>

<style>
	.check-team {
		background-color: rgba(255, 0, 0, 0.291);
	}
</style>
