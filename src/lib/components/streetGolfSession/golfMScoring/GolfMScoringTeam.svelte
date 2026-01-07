<script lang="ts">
	import { slide } from 'svelte/transition';
	import { playersStore } from '$lib/stores/playersStore.svelte';
	import { teamsStore } from '$lib/stores/teamsStore.svelte';
	import { targetsStore } from '$lib/stores/targetsStore.svelte';
	import { sessionSettingsStore } from '$lib/stores/gameSessionStore.svelte';
	import { gameStatus } from '$lib/stores/gameStatusStore.svelte';
	import type { Team } from '$lib/types/teamInterface';

	import Stepper from '$lib/ui/Stepper.svelte';
	import { onMount } from 'svelte';

	const s = sessionSettingsStore.settings;
	const scoringForAllPlayersRules = ['Bonus', 'Individuel'];

	let activeTargetIndex = $derived(gameStatus.currentTargetIndex);

	let currentTarget = $derived(targetsStore.list[activeTargetIndex]);
	let isFirstTarget = $derived(activeTargetIndex === 0);
	let isLastTarget = $derived(activeTargetIndex === targetsStore.list.length - 1);

	let minTrys = $derived(currentTarget?.rule === 'Bonus' ? -3 : 0);

	let maxTrys = $derived(
		currentTarget?.rule === 'Bonus'
			? 0
			: s.hasCrossAFixedPenalty
				? s.malusValue
				: currentTarget.par + s.malusOverPar
	);

	let hasCrossAFixedPenalty = s.hasCrossAFixedPenalty;

	let prevTargetBtn: HTMLButtonElement;
	let nextTargetBtn: HTMLButtonElement;

	function prevTargetClick() {
		prevTargetBtn?.click();
	}

	function nextTargetClick() {
		nextTargetBtn?.click();
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
			if (distance > 0) nextTargetClick();
			else prevTargetClick();
		}
	}

	function showNextTarget() {
		activeTargetIndex++;
		initScoresPlayerOnTarget();
	}

	function showPrevTarget() {
		activeTargetIndex--;
	}

	function initScoresPlayerOnTarget() {
		playersStore.list.forEach((player) => {
			if (player.scores[currentTarget.id] === undefined) {
				player.scores[currentTarget.id] = currentTarget.par;
			}
		});
	}

	function updateScoreTeam(team: Team, targetId: string, score: number) {
		team.playersId.forEach((playerId) => {
			playersStore.updateScore(playerId, targetId, score);
		});
	}

	onMount(() => {
		initScoresPlayerOnTarget();
	});
</script>

<div class="progress-bar">
	<div
		class="fill"
		style="width: {(100 * (activeTargetIndex + 1)) / targetsStore.list.length}%"
	></div>
</div>

<div class="step-content" in:slide>
	<header class="target-header" ontouchstart={handleTouchStart} ontouchend={handleTouchEnd}>
		<button bind:this={prevTargetBtn} onclick={() => showPrevTarget()} disabled={isFirstTarget}
			>◀</button
		>
		<div class="target-info">
			<h3>{currentTarget.name} (# {activeTargetIndex + 1})</h3>
			<div class="target-details">
				<span class="par-badge">{currentTarget.rule}</span>
				{#if !scoringForAllPlayersRules.includes(currentTarget.rule || '')}
					<span class="par-badge">PAR {currentTarget.par}</span>
				{/if}
			</div>
		</div>
		<button bind:this={nextTargetBtn} onclick={() => showNextTarget()} disabled={isLastTarget}
			>▶</button
		>
	</header>

	<div class="scores-grid">
		<table>
			<tbody>
				{#if !scoringForAllPlayersRules.includes(currentTarget.rule || '')}
					{#each teamsStore.list as team}
						{@const player = playersStore.list.find((p) => p.id === team.playersId[0]) || {
							id: '',
							name: '',
							teamId: '',
							scores: {}
						}}
						<tr>
							<td>
								<span class="player-name">{team.name}</span>
							</td>
							<td>
								<Stepper
									value={player.scores[currentTarget.id] ?? 0}
									min={minTrys}
									max={maxTrys}
									onchange={(val) => updateScoreTeam(team, currentTarget.id, val)}
								/>
							</td>
							<td class="btn-actions">
								<button
									class="btn-par"
									onclick={() => updateScoreTeam(team, currentTarget.id, currentTarget.par)}
									title="Par">=</button
								>
								<button
									class="btn-delete"
									onclick={() => updateScoreTeam(team, currentTarget.id, maxTrys)}
									title="Echec">X</button
								>
							</td>
						</tr>
					{/each}
				{:else}
					{#each playersStore.list as player}
						<tr>
							<td>
								<span class="player-name">{player.name}</span>
							</td>
							<td>
								<Stepper
									value={player.scores[currentTarget.id] ?? 0}
									min={minTrys}
									max={maxTrys}
									onchange={(val) => (player.scores[currentTarget.id] = val)}
								/>
							</td>
							<td class="btn-actions">
								<button
									class="btn-par"
									onclick={() => (player.scores[currentTarget.id] = currentTarget.par)}
									title="Par">=</button
								>
								<button
									class="btn-delete"
									onclick={() => (player.scores[currentTarget.id] = maxTrys)}
									title="Echec">X</button
								>
							</td>
						</tr>
					{/each}
				{/if}
			</tbody>
		</table>
	</div>
</div>
