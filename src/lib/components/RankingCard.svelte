<script lang="ts">
	import type { Player } from '$lib/types/playerIntfc';
	import { getTotalStrokes } from '$lib/utils/utils';
	import { holesStore } from '$lib/stores/holesStore';
	import { getRelativeScore } from '$lib/utils/utils';
	import { gameStatus } from '$lib/stores/gameStatusStore';

	export let players: Player[];

	// On recalcule le classement ici de façon réactive
	// $: ranking = [...players].sort((a, b) => getTotal(a.scores) - getTotal(b.scores));
	$: ranking = [...players].sort(
		(a, b) => getRelativeScore(a.scores, $holesStore) - getRelativeScore(b.scores, $holesStore)
	);
</script>

{#if $gameStatus === 'finished'}
	<div class="podium">
		{#each ranking.slice(0, 3) as player, i}
			<div class="podium-spot rank-{i + 1}">
				<span class="medal">{i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}</span>
				<span class="name">{player.name}</span>
				<span class="score">{getRelativeScore(player.scores, $holesStore)}</span>
			</div>
		{/each}
	</div>
{/if}

<section class="ranking-card">
	{#if $gameStatus === 'finished'}
		<h2>🏆 Classement Final</h2>
	{:else}
		<h2>Classement Actuel</h2>
	{/if}
	<ul>
		{#each ranking as player, index}
			<li class="ranking-item">
				<span class="rank">{index + 1}</span>&nbsp;
				<span class="name">{player.name}</span>&nbsp;
				<span class="score">{getTotalStrokes(player.scores)} coups</span>
			</li>
		{/each}
	</ul>
</section>

<style>
	.podium {
		display: flex;
		justify-content: center;
		align-items: flex-end;
		gap: 1rem;
		margin: 2rem 0;
	}
	.podium-spot {
		background: var(--bg-app);
		padding: 1rem;
		border-radius: 12px 12px 0 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}
	.rank-1 {
		height: 80px;
		border: 2px solid #ffd700;
		order: 2;
	}
	.rank-2 {
		height: 60px;
		border: 2px solid silver;
		order: 1;
	}
	.rank-3 {
		height: 40px;
		border: 2px solid #cd7f32;
		order: 3;
	}
</style>
