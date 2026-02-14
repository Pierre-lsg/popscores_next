<script lang="ts">
	import '$lib/styles/scoreCard.css';

	import type { RankedTeam } from '$lib/types/teamType';
	import type { Target } from '$lib/types/targetsType';
	import type { Regulation } from '$lib/types/regulationsType';
	import type { Player } from '$lib/types/playerType';

	import { getTeamStats } from '$lib/utils/session/golfScoringFunction.svelte';

	let {
		rankedTeams,
		targets,
		players,
		settings
	}: {
		rankedTeams: RankedTeam[];
		targets: Target[];
		players: Player[];
		settings: Regulation;
	} = $props<{
		rankedTeams: RankedTeam[];
		targets: Target[];
		players: Player[];
		settings: Regulation;
	}>();
</script>

<div class="list-card">
	{#each rankedTeams as team, i}
		{@const t = team.team}
		{@const stats = getTeamStats(t, targets, players, settings)}
		<div class="item-card">
			<span class="rank"
				>{team.rank}
				{#if team.isTie}
					*
				{/if}
			</span>
			<span class="podium-name">{t.name}</span>
			<span class="podium-score">{stats.gross} ({stats.diff})</span>
		</div>
	{/each}
</div>

<style>
	.podium-name {
		font-size: 1rem;
	}

	.item-card {
		display: flex;
		justify-content: space-between;
		margin: 0.5rem 0rem;
		background-color: var(--bg-card);
	}

	.list-card {
		border: 1px solid var(--primary);
		background-color: var(--bg-card);
		border-radius: 12px;
		padding: 0.5rem;
		margin-bottom: 20px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}
</style>
