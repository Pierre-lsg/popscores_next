<script lang="ts">
	import type { RankedPlayer } from '$lib/types/playerInterface';
	import type { Target } from '$lib/types/targetsInterface';

	import { getPlayerStats } from '$lib/utils/streetGolfSession/golfScoringFunction.svelte';

	let { rankedPlayers, targets }: { rankedPlayers: RankedPlayer[]; targets: Target[] } = $props<{
		rankedPlayers: RankedPlayer[];
		targets: Target[];
	}>();
</script>

<div class="list-card">
	{#each rankedPlayers as player, i}
		{@const p = player.player}
		{@const stats = getPlayerStats(p, targets)}
		<div class="item-card">
			<span class="rank"
				>{player.rank}
				{#if player.isTie}
					*
				{/if}
			</span>
			<span class="podium-name">{p.name}</span>
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
