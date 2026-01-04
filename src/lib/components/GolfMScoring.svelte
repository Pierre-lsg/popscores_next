<script lang="ts">
	import { slide } from 'svelte/transition';
	import { playersStore } from '$lib/stores/playersStore.svelte';
	import { holesStore } from '$lib/stores/holesStore.svelte';
	import { sessionSettingsStore } from '$lib/stores/gameSessionStore.svelte';
	import { gameStatus } from '$lib/stores/gameStatusStore.svelte';

	import Stepper from '$lib/ui/Stepper.svelte';

	const s = sessionSettingsStore.settings;

	let activeHoleIndex = $derived(gameStatus.currentHoleIndex);

	let currentHole = $derived(holesStore.list[activeHoleIndex]);
	let isFirstHole = $derived(activeHoleIndex === 0);
	let isLastHole = $derived(activeHoleIndex === holesStore.list.length - 1);

	let minTrys = $derived(currentHole?.rule === 'Bonus' ? -3 : 0);

	let maxTrys = $derived(
		currentHole?.rule === 'Bonus'
			? 0
			: s.hasCrossAFixedPenalty
				? s.malusValue
				: currentHole.par + s.malusOverPar
	);

	let hasCrossAFixedPenalty = s.hasCrossAFixedPenalty;

	let prevHoleBtn: HTMLButtonElement;
	let nextHoleBtn: HTMLButtonElement;

	function prevHoleClick() {
		prevHoleBtn?.click();
	}

	function nextHoleClick() {
		nextHoleBtn?.click();
	}

	// --
	// Code pour gestion du Swipe
	// Todo: à refactoriser car utilisé ailleurs
	let touchStartX = 0;
	let touchEndX = 0;

	// Seuil minimal pour éviter de changer d'écran par erreur (en pixels)
	const SWIPE_THRESHOLD = 50;

	function handleTouchStart(e: TouchEvent) {
		touchStartX = e.changedTouches[0].screenX;
	}

	function handleTouchEnd(e: TouchEvent) {
		touchEndX = e.changedTouches[0].screenX;
		checkSwipe();
	}

	function checkSwipe() {
		const distance = touchEndX - touchStartX;

		if (Math.abs(distance) > SWIPE_THRESHOLD) {
			if (distance > 0) nextHoleClick();
			else prevHoleClick();
		}
	}
	// --
</script>

<div class="step-content" in:slide>
	<header class="hole-header" ontouchstart={handleTouchStart} ontouchend={handleTouchEnd}>
		<button bind:this={prevHoleBtn} onclick={() => activeHoleIndex--} disabled={isFirstHole}
			>◀</button
		>
		<div class="hole-info">
			<h3>{currentHole.name} (# {activeHoleIndex + 1})</h3>
			<div class="hole-details">
				<span class="par-badge">{currentHole.rule}</span>
				{#if currentHole.rule !== 'Bonus'}
					<span class="par-badge">PAR {currentHole.par}</span>
				{/if}
			</div>
		</div>
		<button bind:this={nextHoleBtn} onclick={() => activeHoleIndex++} disabled={isLastHole}
			>▶</button
		>
	</header>

	<div class="scores-grid">
		<table>
			<tbody>
				{#each playersStore.list as player}
					<tr>
						<td>
							<span class="player-name">{player.name}</span>
						</td>
						<td>
							<Stepper bind:value={player.scores[activeHoleIndex]} min={minTrys} max={maxTrys} />
						</td>
						<td class="btn-actions">
							<button
								class="btn-par"
								onclick={() => (player.scores[activeHoleIndex] = currentHole.par)}
								title="Par">=</button
							>
							<button
								class="btn-delete"
								onclick={() => (player.scores[activeHoleIndex] = maxTrys)}
								title="Echec">X</button
							>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
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

	.btn-actions {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: var(--bg-card);
	}

	.player-name {
		font-weight: 600;
		font-size: 1.1rem;
	}

	.btn-par {
		background: #cdcdff;
		color: #2855c6;
		border: none;
		border-radius: 50%;
		width: 30px;
		height: 30px;
		font-weight: bold;
		font-size: 1.2rem;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: background 0.2s;
	}
</style>
