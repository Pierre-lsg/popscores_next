<script lang="ts">
	import type { Competition } from '$lib/types/competitionType';
	import type { Fly } from '$lib/types/flyType';
	import type { Course } from '$lib/types/courseType';
	import type { Target } from '$lib/types/targetsType';
	import type { Player } from '$lib/types/playerType';
	import type { RankedPlayer } from '$lib/types/playerType';
	import type { Regulations } from '$lib/types/regulationsType';
	import type { Result } from '$lib/types/resultType';

	import { regulationsStore } from '$lib/stores/championship/regulationsStore.svelte';
	import { coursesChampionshipStore } from '$lib/stores/championship/coursesChampionshipStore.svelte';
	import { playersChampionshipStore } from '$lib/stores/championship/playersChampionshipStore.svelte';
	import { resultsCompetition } from '$lib/stores/championship/resultsCompetitionStore.svelte';

	import { swipe } from '$lib/utils/swipe';
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
			: rules?.regulation.hasCrossAFixedPenalty
				? rules?.regulation.malusValue
				: currentTarget.par + (rules?.regulation.malusOverPar || 4)
	);
	let isCourseEnded: boolean = $state(false);

	const showNextTarget = () => {
		if (confirm('Validez-vous les scores saisis pour cette cible ?')) {
			currentFly.status = 'in_progress';
			if (activeTargetIndex < targets.length) activeTargetIndex++;
			else activeTargetIndex = 0;
			initScoresPlayerOnTarget();
			if (!isCourseEnded) if (checkAllTargetsValidated()) isCourseEnded = true;
		}
	};

	const checkAllTargetsValidated = (): boolean => {
		// Pour chaque cible du parcours, chaque joueur du fly, un score est-il inscrit ?
		let allTargetsValidated: boolean = true;
		targets.forEach((t) => {
			players.forEach((p) => {
				if (p.scores[t.id] === undefined) allTargetsValidated = false;
			});
		});
		return allTargetsValidated;
	};

	const showPrevTarget = () => {
		if (confirm('Validez-vous les scores saisis pour cette cible ?')) {
			currentFly.status = 'in_progress';
			if (activeTargetIndex > 0) activeTargetIndex--;
			else activeTargetIndex = targets.length - 1;
			initScoresPlayerOnTarget();
			if (!isCourseEnded) if (checkAllTargetsValidated()) isCourseEnded = true;
		}
	};

	const initScoresPlayerOnTarget = () => {
		players.forEach((player) => {
			if (currentTarget)
				if (player.scores[currentTarget.id] === undefined) {
					player.scores[currentTarget.id] = currentTarget.par;
				}
		});
	};

	const validateFly = () => {
		// Sauver les scores dans le ResultStore
		players.forEach((player) => {
			let result = resultsCompetition.find(currentCompetition.id, player.id);
			if (result) {
				result.scores = player.scores;
			} else {
				resultsCompetition.add(currentCompetition.id, player.id, player.scores);
			}
		});

		// Modifier le status du fly
		currentFly.status = 'validated';
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

		initScoresPlayerOnTarget();
		if (!isCourseEnded) if (checkAllTargetsValidated()) isCourseEnded = true;
	});
</script>

<div>
	<div class="action">
		<button onclick={() => (currentFly = undefined)}>Retour</button>
		{#if isCourseEnded}
			<button onclick={() => validateFly()}>Valider le fly</button>
		{/if}
	</div>
	<!-- Saisie des résultats d'une cible pour un fly -->
	<div class="step-content" in:slide>
		<header
			role="none"
			class="target-header"
			use:swipe={{ onRight: showNextTarget, onLeft: showPrevTarget }}
		>
			<button class="btn-target" onclick={() => showPrevTarget()} disabled={isFirstTarget}>◀</button
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
			<button class="btn-target" onclick={() => showNextTarget()} disabled={isLastTarget}>▶</button>
		</header>

		<div class="scores-grid">
			<table>
				<tbody>
					{#each players as player}
						<tr class="score">
							<td class="player-name">
								{player.name}
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
									title="Echec">x</button
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
