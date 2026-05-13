<script lang="ts">
	import type { RankedPlayer } from '$lib/types/playerType';
	import type { Target } from '$lib/types/targetType';
	import '$lib/styles/rankingPodium.css';

	import { getPlayerStats } from '$lib/utils/session/golfScoringFunction.svelte';

	let { rankedPlayers, targets }: { rankedPlayers: RankedPlayer[]; targets: Target[] } = $props<{
		rankedPlayers: RankedPlayer[];
		targets: Target[];
	}>();
</script>

<div class="others-list">
	{#each rankedPlayers as player, i}
		{@const p = player.player}
		{@const stats = getPlayerStats(p, targets)}
		<div class="other-item">
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
</style>
