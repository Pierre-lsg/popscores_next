<script lang="ts">
	import { slide } from 'svelte/transition';
	import { playersStore } from '$lib/stores/playersStore';
	import { holesStore } from '$lib/stores/holesStore';
	import { sessionSettings } from '$lib/stores/gameSessionStore';
	import { currentHoleIndex } from '$lib/stores/gameStatusStore';

	import Stepper from '$lib/ui/Stepper.svelte';

	$: currentHole = $holesStore[activeHoleIndex];
	$: isFirstHole = activeHoleIndex === 0;
	$: isLastHole = activeHoleIndex === $holesStore.length - 1;
	$: currentHoleIndex.set(activeHoleIndex);

	$: minTrys = currentHole.rule === 'Bonus' ? -3 : 0;
	$: maxTrys =
		currentHole.rule === 'Bonus'
			? 0
			: hasCrossAFixedPenalty
				? $sessionSettings.fixedMalus
				: currentHole.par + $sessionSettings.malusOverPar;

	let activeHoleIndex = $currentHoleIndex || 0;
	let hasCrossAFixedPenalty = $sessionSettings.hasCrossAFixedPenalty;
</script>

<div class="step-content" in:slide>
	<h2>📝 Saisie des scores</h2>
	<header class="hole-header">
		<button on:click={() => activeHoleIndex--} disabled={isFirstHole}>◀</button>
		<div class="hole-info">
			<h3>Trou {activeHoleIndex + 1}</h3>
			<div class="hole-details">
				<span class="par-badge">{currentHole.rule}</span>
				{#if currentHole.rule !== 'Bonus'}
					<span class="par-badge">PAR {currentHole.par}</span>
				{/if}
			</div>
		</div>
		<button on:click={() => activeHoleIndex++} disabled={isLastHole}>▶</button>
	</header>

	<div class="scores-grid">
		{#each $playersStore as player}
			<div class="score-row">
				<span class="player-name">{player.name}</span>
				<Stepper bind:value={player.scores[activeHoleIndex]} min={minTrys} max={maxTrys} />
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

	.hole-info {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 80%;
		gap: 0.3rem;
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

	.hole-details {
		display: flex;
		gap: 0.5rem;
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
