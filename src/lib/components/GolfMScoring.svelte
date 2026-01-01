<script lang="ts">
	import { slide } from 'svelte/transition';
	import { playersStore } from '$lib/stores/playersStore';
	import { holesStore } from '$lib/stores/holesStore';
	import Stepper from '$lib/ui/Stepper.svelte';
	import { currentHoleIndex } from '$lib/stores/gameStatusStore';

	let activeHoleIndex = $currentHoleIndex || 0;
	let maxTrys = 10;

	$: currentHole = $holesStore[activeHoleIndex];
	$: isFirstHole = activeHoleIndex === 0;
	$: isLastHole = activeHoleIndex === $holesStore.length - 1;
	$: currentHoleIndex.set(activeHoleIndex);
</script>

<div class="step-content" in:slide>
	<header class="hole-header">
		<button on:click={() => activeHoleIndex--} disabled={isFirstHole}>◀</button>
		<div class="hole-info">
			<h3>Trou {activeHoleIndex + 1}</h3>
			<span class="par-badge">PAR {currentHole.par}</span>
		</div>
		<button on:click={() => activeHoleIndex++} disabled={isLastHole}>▶</button>
	</header>

	<div class="scores-grid">
		{#each $playersStore as player}
			<div class="score-row">
				<span class="player-name">{player.name}</span>
				<Stepper bind:value={player.scores[activeHoleIndex]} min={1} max={maxTrys} />
				<button
					class="btn-delete"
					on:click={() => (player.scores[activeHoleIndex] = maxTrys)}
					title="Echec">X</button
				>
			</div>
		{/each}
	</div>
</div>

<style>
	.step-content {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.hole-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: var(--bg-card);
		padding: 1rem;
		border-radius: 12px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.par-badge {
		background: var(--primary-light);
		color: var(--primary);
		padding: 2px 8px;
		border-radius: 4px;
		font-weight: bold;
	}

	.score-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: var(--bg-card);
		padding: 0.8rem;
		border-radius: 8px;
		margin-bottom: 0.5rem;
		border: 1px solid var(--border-color);
	}

	.player-name {
		font-weight: 600;
		font-size: 1.1rem;
	}
</style>
