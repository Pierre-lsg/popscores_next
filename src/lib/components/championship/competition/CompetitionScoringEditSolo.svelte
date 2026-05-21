<script lang="ts">
	import { confirmStore } from '$lib/stores/confirmStore.svelte';
	import type { Competition } from '$lib/types/competitionType';
	import type { Fly } from '$lib/types/flyType';
	import type { Course } from '$lib/types/courseType';
	import type { Target } from '$lib/types/targetType';
	import type { Player } from '$lib/types/playerType';
	import type { RankedPlayer } from '$lib/types/playerType';
	import type { Regulation, Regulations } from '$lib/types/regulationsType';

	import { coursesChampionshipStore } from '$lib/stores/championship/coursesChampionshipStore.svelte';
	import { playersChampionshipStore } from '$lib/stores/championship/playersChampionshipStore.svelte';
	import { resultsCompetitionStore } from '$lib/stores/championship/resultsCompetitionStore.svelte';

	import { resultService } from '$lib/utils/pocketbase/results2Cloud';
	import { networkStatus } from '$lib/stores/networkStore.svelte';
	import { flyService } from '$lib/utils/pocketbase/flys2Cloud';
	import { playerService } from '$lib/utils/pocketbase/players2Cloud';

	import { swipe } from '$lib/utils/swipe';
	import { slide } from 'svelte/transition';
	import Stepper from '$lib/ui/Stepper.svelte';
	import { navContext } from '$lib/utils/nav.svelte';

	import PlayerScoreCardByTarget from '$lib/components/core_game/PlayerScoreCardByTarget.svelte';
	import { getRankedPlayers } from '$lib/utils/session/golfScoringFunction.svelte';
	import { onMount } from 'svelte';
	import {
		cloudSaveScoreCard,
		getRules
	} from '$lib/utils/championship/competitionsFunctions.svelte';
	import { messageStore } from '$lib/stores/appEventStore.svelte';
	import ScoreHeader from '$lib/components/core_game/scoring/ScoreHeader.svelte';
	import ScoreGrid from '$lib/components/core_game/scoring/ScoreGrid.svelte';

	let { currentCompetition = $bindable(), currentFly = $bindable() } = $props<{
		currentCompetition: Competition | undefined;
		currentFly: Fly | undefined;
	}>();

	let rules: Regulations = $state(getRules(currentCompetition));
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
	let isOnline: boolean = $state(true);

	$effect(() => {
		if (networkStatus.isOnline) isOnline = true;
		else isOnline = false;
	});

	const showNextTarget = async () => {
		if (await confirmStore.prompt('Validez-vous les scores saisis pour cette cible ?')) {
			currentFly.status = 'in_progress';
			if (isOnline) saveProgressToCloud();
			if (activeTargetIndex < targets.length - 1) activeTargetIndex++;
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

	const showPrevTarget = async () => {
		if (await confirmStore.prompt('Validez-vous les scores saisis pour cette cible ?')) {
			currentFly.status = 'in_progress';
			if (isOnline) saveProgressToCloud();
			if (activeTargetIndex > 0) activeTargetIndex--;
			else activeTargetIndex = targets.length - 1;
			initScoresPlayerOnTarget();
			if (!isCourseEnded) if (checkAllTargetsValidated()) isCourseEnded = true;
		}
	};

	const saveProgressToCloud = async () => {
		if (isOnline) {
			flyService.saveFly(currentFly);
			messageStore.remove('sendFly');
		}
		// Sauver les scores dans le ResultStore
		players.forEach((player) => {
			let result = resultsCompetitionStore.find(currentCompetition.id, player.id);
			if (result) {
				result.scores = player.scores;
			} else {
				result = resultsCompetitionStore.add(currentCompetition.id, player.id, player.scores);
			}
			// Sauver le résultat dans le Cloud si c'est possible
			if (isOnline) {
				playerService.savePlayer(player);
				resultService.saveResult(result);
			}
		});
	};

	const initScoresPlayerOnTarget = async () => {
		players.forEach((player) => {
			if (currentTarget)
				if (player.scores[currentTarget.id] === undefined) {
					player.scores[currentTarget.id] = currentTarget.par;
				}
		});
	};

	const validateFly = async () => {
		saveProgressToCloud();
		// transmettre la carte de score
		if (isOnline)
			cloudSaveScoreCard(
				currentCompetition,
				currentFly,
				[],
				rankedPlayers,
				targets,
				[],
				rules?.regulation || ({} as Regulation)
			);

		// Modifier le status du fly
		if (isOnline) {
			currentFly.status = 'validated';
			flyService.saveFly(currentFly);
			messageStore.remove('sendFly');
		} else {
			currentFly.status = 'finished';
			messageStore.add('sendFly', 'warning', 'Veuillez transmettre les résultats du fly');
		}
	};



	onMount(() => {
		initScoresPlayerOnTarget();
		if (!isCourseEnded) if (checkAllTargetsValidated()) isCourseEnded = true;
		navContext.headerAction = returnButton;
		return () => (navContext.headerAction = returnButtonPrev);
	});
</script>

{#snippet returnButton()}
	<span class="btn btn-back" role="none" onclick={async () => (currentFly = undefined)}>
		⛳ Accueil
	</span>
{/snippet}

{#snippet returnButtonPrev()}
	<span class="btn btn-back" role="none" onclick={async () => (currentCompetition = undefined)}>
		⛳ Accueil
	</span>
{/snippet}

<div>
	<div class="action">
		<button onclick={async () => (currentFly = undefined)} class="btn">Retour</button>
		{#if isCourseEnded && currentFly.status === 'in_progress'}
			<button onclick={async () => validateFly()} class="btn btn-primary">
				Valider{isOnline ? ' et transmettre ' : ' '}le fly
			</button>
		{/if}
		{#if isCourseEnded && (currentFly.status === 'validated' || currentFly.status === 'finished')}
			<button onclick={async () => validateFly()} class="btn btn-primary">
				Corriger{isOnline ? ' et transmettre ' : ' '}le fly
			</button>
		{/if}
	</div>
	<!-- Saisie des résultats d'une cible pour un fly -->
	<div class="step-content" in:slide>
		{#if currentTarget}
			<ScoreHeader
				target={currentTarget}
				{targets}
				{activeTargetIndex}
				allowSelect={true}
				onNext={showNextTarget}
				onPrev={showPrevTarget}
				onTargetSelect={(idx) => activeTargetIndex = idx}
			/>

			<ScoreGrid
				target={currentTarget}
				{players}
				{minTrys}
				{maxTrys}
				onScoreChange={(playerId, targetId, score) => {
					const player = players.find(p => p.id === playerId);
					if (player) player.scores[targetId] = score;
				}}
			/>
		{/if}
	</div>

	<!-- Affichage de la carte de score -->
	<PlayerScoreCardByTarget {rankedPlayers} {targets} />
</div>
