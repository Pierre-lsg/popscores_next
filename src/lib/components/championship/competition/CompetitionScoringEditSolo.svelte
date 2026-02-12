<script lang="ts">
	import type { Competition } from '$lib/types/competitionType';
	import type { Fly } from '$lib/types/flyType';
	import type { Course } from '$lib/types/courseType';
	import type { Target } from '$lib/types/targetsType';
	import type { Player } from '$lib/types/playerType';
	import type { RankedPlayer } from '$lib/types/playerType';
	import type { Regulations } from '$lib/types/regulationsType';

	import { regulationsStore } from '$lib/stores/championship/regulationsStore.svelte';
	import { coursesChampionshipStore } from '$lib/stores/championship/coursesChampionshipStore.svelte';
	import { playersChampionshipStore } from '$lib/stores/championship/playersChampionshipStore.svelte';

	import { slide } from 'svelte/transition';
	import Stepper from '$lib/ui/Stepper.svelte';
	import PlayerScoreCardByTarget from '$lib/ui/PlayerScoreCardByTarget.svelte';
	import { getRankedPlayers } from '$lib/utils/session/golfScoringFunction.svelte';
	import { onMount } from 'svelte';

	let { currentCompetition = $bindable(), currentFly = $bindable() } = $props<{
		currentCompetition: Competition | undefined;
		currentFly: Fly | undefined;
	}>();

	let rules: Regulations | undefined = $state();
	let course: Course | undefined = $derived(
		coursesChampionshipStore.find(currentCompetition.courseId)
	);
	let players: Player[] | undefined = $derived(
		playersChampionshipStore.list.filter((p) => currentFly.playersId.includes(p.id))
	);
	let targets: Target[] = $derived(course?.targets || []);
	let rankedPlayers: RankedPlayer[] = $derived(getRankedPlayers(players, targets || []));
	let activeTargetIndex: number = $state(0);
	let currentTarget: Target | undefined = $derived(targets[activeTargetIndex]);
	let isFirstTarget = $derived(activeTargetIndex === 0);
	let isLastTarget = $derived(activeTargetIndex === targets.length - 1);
	let minTrys = $derived(currentTarget?.rule === 'Bonus' ? -3 : 0);
	let maxTrys = $derived(
		currentTarget?.rule === 'Bonus'
			? 0
			: rules?.hasCrossAFixedPenalty
				? rules?.malusValue
				: currentTarget.par + (rules?.malusOverPar || 4)
	);

	// Swipe mécanism params
	let prevTargetBtn: HTMLButtonElement;
	let nextTargetBtn: HTMLButtonElement;
	let touchStartX = 0;
	let touchEndX = 0;
	const SWIPE_THRESHOLD = 50;
	// Swipe mécanism params end

	// Swipe mecanism functions
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
	// Swipe mecanism functions end

	const showNextTarget = () => {
		activeTargetIndex++;
		initScoresPlayerOnTarget();
	};

	const showPrevTarget = () => {
		activeTargetIndex--;
	};

	const initScoresPlayerOnTarget = () => {
		players.forEach((player) => {
			if (currentTarget)
				if (player.scores[currentTarget.id] === undefined) {
					player.scores[currentTarget.id] = currentTarget.par;
				}
		});
	};

	onMount(() => {
		if (currentCompetition) {
			if (currentCompetition.regulationsId !== '')
				rules = regulationsStore.find(currentCompetition.regulationsId);
			if (!rules) {
				rules = regulationsStore.new();
				currentCompetition.regulationsId = rules.id;
			}
		}
	});
</script>

<div>
	<button onclick={() => (currentFly = undefined)}>Retour</button>
	<!-- Saisie des résultats d'une cible pour un fly -->
	<div class="step-content" in:slide>
		<header
			role="none"
			class="target-header"
			ontouchstart={handleTouchStart}
			ontouchend={handleTouchEnd}
		>
			<button bind:this={prevTargetBtn} onclick={() => showPrevTarget()} disabled={isFirstTarget}
				>◀</button
			>
			<div class="target-info">
				<h3>{currentTarget.name} (# {activeTargetIndex + 1})</h3>
				<div class="target-details">
					<span>{currentTarget.rule}</span>
					{#if currentTarget.rule !== 'Bonus'}
						<span>PAR {currentTarget.par}</span>
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
					{#each players as player}
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
				</tbody>
			</table>
		</div>
	</div>

	<!-- Affichage de la carte de score -->
	<PlayerScoreCardByTarget {rankedPlayers} {targets} />
</div>

<style>
</style>
