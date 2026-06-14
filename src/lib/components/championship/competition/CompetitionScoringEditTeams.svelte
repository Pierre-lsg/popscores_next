<script lang="ts">
	import { confirmStore } from '$lib/stores/confirmStore.svelte';
	import type { Competition } from '$lib/types/competitionType';
	import type { Fly } from '$lib/types/flyType';
	import type { Course } from '$lib/types/courseType';
	import type { Target } from '$lib/types/targetType';
	import type { Team } from '$lib/types/teamType';
	import type { Player } from '$lib/types/playerType';
	import type { Regulations, Regulation } from '$lib/types/regulationsType';
	import { individualRules } from '$lib/types/targetType';

	import { coursesChampionshipStore } from '$lib/stores/championship/coursesChampionshipStore.svelte';
	import { teamsCompetitionStore } from '$lib/stores/championship/teamsCompetitionStore.svelte';
	import { playersChampionshipStore } from '$lib/stores/championship/playersChampionshipStore.svelte';
	import { resultsCompetitionStore } from '$lib/stores/championship/resultsCompetitionStore.svelte';
	import { networkStatus } from '$lib/stores/networkStore.svelte';

	import { getRankedTeams } from '$lib/utils/session/golfScoringFunction.svelte';
	import { resultService } from '$lib/utils/pocketbase/results2Cloud';
	import { playerService } from '$lib/utils/pocketbase/players2Cloud';
	import { flyService } from '$lib/utils/pocketbase/flys2Cloud';

	import Stepper from '$lib/ui/Stepper.svelte';
	import { navContext } from '$lib/utils/nav.svelte';

	import TeamScoreCardByTarget from '$lib/components/core_game/TeamScoreCardByTarget.svelte';
	import Selector from '$lib/ui/Selector.svelte';
	import {
		cloudSaveScoreCard,
		getRules
	} from '$lib/utils/championship/competitionsFunctions.svelte';
	import { messageStore } from '$lib/stores/appEventStore.svelte';
	import { onMount } from 'svelte';
	import { swipe } from '$lib/utils/swipe';
	import { slide } from 'svelte/transition';
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
	let teams: Team[] | undefined = $derived(
		teamsCompetitionStore.list.filter(
			(t) => currentFly.teamsId.includes(t.id) && t.sessionId === currentCompetition.id
		)
	);
	let players: Player[] | undefined = $derived(
		playersChampionshipStore.list.filter((p) =>
			teams
				.map((t) => t.playersId)
				.flat()
				.includes(p.id)
		)
	);
	let regulation: Regulation = $state(rules.regulation);
	let targets: Target[] = $derived(course?.targets || []);
	let rankedTeams = $derived(getRankedTeams(teams, targets, players, regulation));

	let activeTargetIndex: number = $state(0);
	let currentTarget: Target | undefined = $derived(targets[activeTargetIndex]);
	let isFirstTarget = $derived(activeTargetIndex === 0);
	let isLastTarget = $derived(activeTargetIndex === targets.length - 1);
	let minTrys = $derived(
		currentTarget?.rule === 'Bonus' || currentTarget?.rule === 'Team_Bonus' ? -3 : 0
	);
	let maxTrys = $derived(
		currentTarget?.rule === 'Bonus' || currentTarget?.rule === 'Team_Bonus'
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
			await flyService.saveFly(currentFly);
			messageStore.remove('sendFly');
		}
		// Sauver les scores dans le ResultStore
		for (const player of players) {
			let result = resultsCompetitionStore.find(currentCompetition.id, player.id);
			if (result) {
				result.scores = player.scores;
			} else {
				result = resultsCompetitionStore.add(currentCompetition.id, player.id, player.scores);
			}
			// Sauver le résultat dans le Cloud si c'est possible
			if (isOnline) {
				await playerService.savePlayer(player);
				await resultService.saveResult(result);
			}
		}
	};

	const initScoresPlayerOnTarget = async () => {
		players.forEach((player) => {
			if (currentTarget)
				if (player.scores[currentTarget.id] === undefined) {
					player.scores[currentTarget.id] = currentTarget.par;
				}
		});
	};

	const updateScoreTeam = async (team: Team, targetId: string, score: number) => {
		team.playersId.forEach((playerId) => {
			if (players) {
				const player = players.find((p) => p.id === playerId);
				if (player) player.scores[targetId] = score;
			}
		});
	};

	const validateFly = async () => {
		saveProgressToCloud();
		// Transmettre la carte de score
		if (isOnline)
			cloudSaveScoreCard(
				currentCompetition,
				currentFly,
				rankedTeams,
				[],
				targets,
				players,
				regulation
			);

		// Modifier le status du fly
		if (isOnline) {
			currentFly.status = 'validated';
			await flyService.saveFly(currentFly);
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
				{teams}
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
	<TeamScoreCardByTarget {rankedTeams} {targets} {players} settings={regulation} />
</div>
