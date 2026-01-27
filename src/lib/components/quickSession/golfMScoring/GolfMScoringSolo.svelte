<script lang="ts">
	import { slide } from 'svelte/transition';
	import { playersStore } from '$lib/stores/quickSession/playersStore.svelte';
	import { targetsStore } from '$lib/stores/quickSession/targetsStore.svelte';
	import { sessionSettingsStore } from '$lib/stores/gameSessionStore.svelte';
	import { gameStatus } from '$lib/stores/gameStatusStore.svelte';

	import Stepper from '$lib/ui/Stepper.svelte';
	import { onMount } from 'svelte';
	import { getRankedPlayers, getPlayerStats } from '$lib/utils/session/golfScoringFunction.svelte';

	const s = sessionSettingsStore.settings;
	const ruleOptions = ['Individuel', 'Bonus'];

	let activeTargetIndex = $derived(gameStatus.currentTargetIndex);
	let rankedPlayerList = $derived(getRankedPlayers(playersStore.list, targetsStore.list));

	let currentTarget = $derived(targetsStore.list[activeTargetIndex]);
	let isFirstTarget = $derived(activeTargetIndex === 0);
	let isLastTarget = $derived(activeTargetIndex === targetsStore.list.length - 1);
	let updatingPar: boolean = $state(false);
	let updatingRule: boolean = $state(false);

	let minTrys = $derived(currentTarget?.rule === 'Bonus' ? -3 : 0);
	let maxTrys = $derived(
		currentTarget?.rule === 'Bonus'
			? 0
			: s.hasCrossAFixedPenalty
				? s.malusValue
				: currentTarget.par + s.malusOverPar
	);

	let prevTargetBtn: HTMLButtonElement;
	let nextTargetBtn: HTMLButtonElement;

	let touchStartX = 0;
	let touchEndX = 0;

	let showRanking: boolean = $state(false);

	const SWIPE_THRESHOLD = 50;

	const prevTargetClick = () => {
		prevTargetBtn?.click();
	};

	const nextTargetClick = () => {
		nextTargetBtn?.click();
	};

	const handleTouchStart = (e: TouchEvent) => {
		touchStartX = e.changedTouches[0].screenX;
	};

	const handleTouchEnd = (e: TouchEvent) => {
		touchEndX = e.changedTouches[0].screenX;
		checkSwipe();
	};

	const checkSwipe = () => {
		const distance = touchEndX - touchStartX;

		if (Math.abs(distance) > SWIPE_THRESHOLD) {
			if (distance > 0) nextTargetClick();
			else prevTargetClick();
		}
	};

	const showNextTarget = () => {
		updatingPar = false;
		updatingRule = false;
		activeTargetIndex++;
		initScoresPlayerOnTarget();
	};

	const showPrevTarget = () => {
		updatingPar = false;
		updatingRule = false;
		activeTargetIndex--;
	};

	const initScoresPlayerOnTarget = () => {
		playersStore.list.forEach((player) => {
			if (player.scores[currentTarget.id] === undefined) {
				playersStore.updateScore(player.id, currentTarget.id, currentTarget.par);
			}
		});
	};

	const modifyPar = () => {
		updatingRule = false;
		updatingPar = !updatingPar;
	};

	const modifyRule = () => {
		updatingPar = false;
		updatingRule = !updatingRule;
	};

	onMount(() => {
		initScoresPlayerOnTarget();
	});
</script>

<div class="step-content">
	<div
		onpointerdown={() => (showRanking = true)}
		onpointerup={() => (showRanking = false)}
		onpointerleave={() => (showRanking = false)}
		ontouchend={() => (showRanking = false)}
	>
		🔥 Provisoire
	</div>
	{#if showRanking}
		<div class="others-list">
			{#each rankedPlayerList as player, i}
				{@const p = player.player}
				{@const stats = getPlayerStats(p, targetsStore.list)}
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
	{/if}
</div>

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
				<span role="none" class="par-badge" onclick={() => modifyRule()}>{currentTarget.rule}</span>
				{#if currentTarget.rule !== 'Bonus'}
					<span role="none" class="par-badge" onclick={() => modifyPar()}
						>PAR {currentTarget.par}</span
					>
				{/if}
			</div>
		</div>
		<button bind:this={nextTargetBtn} onclick={() => showNextTarget()} disabled={isLastTarget}
			>▶</button
		>
	</header>

	{#if updatingPar}
		<Stepper
			label="Modification du Par : "
			bind:value={currentTarget.par}
			min={0}
			disabled={currentTarget.rule === 'Bonus'}
		/>
	{/if}

	{#if updatingRule}
		<div class="target-details" style="background-color: var(--bg-card);">
			Modification de la règle :
			<select
				id="rule{currentTarget.id}"
				bind:value={currentTarget.rule}
				onchange={() => (currentTarget.par = currentTarget.rule === 'Bonus' ? 0 : 4)}
			>
				{#each ruleOptions as option}
					<option value={option}>{option}</option>
				{/each}
			</select>
		</div>
	{/if}

	<div class="scores-grid">
		<table>
			<tbody>
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
								onchange={(val) => playersStore.updateScore(player.id, currentTarget.id, val)}
							/>
						</td>
						<td class="btn-actions">
							<button
								class="btn-par"
								onclick={() =>
									playersStore.updateScore(player.id, currentTarget.id, currentTarget.par)}
								title="Par">=</button
							>
							<button
								class="btn-delete"
								onclick={() => playersStore.updateScore(player.id, currentTarget.id, maxTrys)}
								title="Echec">X</button
							>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
