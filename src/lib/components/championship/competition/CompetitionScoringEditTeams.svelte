<script lang="ts">
	import type { Competition } from '$lib/types/competitionType';
	import type { Fly } from '$lib/types/flyType';
	import type { Course } from '$lib/types/courseType';
	import type { Target } from '$lib/types/targetType';
	import type { Team } from '$lib/types/teamType';
	import type { Player } from '$lib/types/playerType';
	import type { Regulations, Regulation } from '$lib/types/regulationsType';
	import { individualRules } from '$lib/types/targetType';

	import { coursesChampionshipStore } from '$lib/stores/championship/coursesChampionshipStore.svelte';
	import { teamsChampionshipStore } from '$lib/stores/championship/teamsChampionshipStore.svelte';
	import { playersChampionshipStore } from '$lib/stores/championship/playersChampionshipStore.svelte';
	import { resultsCompetitionStore } from '$lib/stores/championship/resultsCompetitionStore.svelte';
	import { networkStatus } from '$lib/stores/networkStore.svelte';

	import { swipe } from '$lib/utils/swipe';
	import { slide } from 'svelte/transition';
	import Stepper from '$lib/ui/Stepper.svelte';
	import TeamScoreCardByTarget from '$lib/ui/TeamScoreCardByTarget.svelte';
	import Selector from '$lib/ui/Selector.svelte';
	import { getRankedTeams } from '$lib/utils/session/golfScoringFunction.svelte';
	import { resultService } from '$lib/utils/pocketbase/Result2Cloud';
	import {
		cloudSaveScoreCard,
		getRules
	} from '$lib/utils/championship/competitionsFunctions.svelte';
	import { messageStore } from '$lib/stores/appEventStore.svelte';
	import { onMount } from 'svelte';

	let { currentCompetition = $bindable(), currentFly = $bindable() } = $props<{
		currentCompetition: Competition | undefined;
		currentFly: Fly | undefined;
	}>();

	let rules: Regulations = $state(getRules(currentCompetition));
	let course: Course | undefined = $derived(
		coursesChampionshipStore.find(currentCompetition.courseId)
	);
	let teams: Team[] | undefined = $derived(
		teamsChampionshipStore.list.filter((t) => currentFly.teamsId.includes(t.id))
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
	let isSelectingTarget: boolean = $state(false);
	let selectedTarget: string = $state('');

	$effect(() => {
		if (networkStatus.isOnline) isOnline = true;
		else isOnline = false;
	});

	const showNextTarget = () => {
		if (confirm('Validez-vous les scores saisis pour cette cible ?')) {
			currentFly.status = 'in_progress';
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

	const updateScoreTeam = (team: Team, targetId: string, score: number) => {
		team.playersId.forEach((playerId) => {
			if (players) {
				const player = players.find((p) => p.id === playerId);
				if (player) player.scores[targetId] = score;
			}
		});
	};

	const validateFly = () => {
		// Sauver les scores dans le ResultStore
		players.forEach((player) => {
			let result = resultsCompetitionStore.find(currentCompetition.id, player.id);
			if (result) {
				result.scores = player.scores;
			} else {
				result = resultsCompetitionStore.add(currentCompetition.id, player.id, player.scores);
			}
			// Sauver le résultat dans le Cloud si c'est possible
			if (isOnline) resultService.saveResult(result);
		});
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
			messageStore.remove('sendFly');
		} else {
			currentFly.status = 'finished';
			messageStore.add('sendFly', 'warning', 'Veuillez transmettre les résultats du fly');
		}
	};

	const changeTarget = () => {
		activeTargetIndex = parseInt(selectedTarget);
		isSelectingTarget = false;
	};

	onMount(() => {
		initScoresPlayerOnTarget();
		if (!isCourseEnded) if (checkAllTargetsValidated()) isCourseEnded = true;
	});
</script>

<div>
	<div class="action">
		<button onclick={() => (currentFly = undefined)}>Retour</button>
		{#if isCourseEnded && currentFly.status === 'in_progress'}
			<button onclick={() => validateFly()}
				>Valider{isOnline ? ' et transmettre ' : ' '}le fly</button
			>
		{/if}
		{#if isCourseEnded && (currentFly.status === 'validated' || currentFly.status === 'finished')}
			<button onclick={() => validateFly()}
				>Corriger{isOnline ? ' et transmettre ' : ' '}le fly</button
			>
		{/if}
	</div>
	<!-- Saisie des résultats d'une cible pour un fly -->
	<div class="step-content" in:slide>
		<header
			role="none"
			class="target-header"
			use:swipe={{ onRight: showNextTarget, onLeft: showPrevTarget }}
		>
			<button class="btn-target" onclick={() => showPrevTarget()}>◀</button>
			<div class="target-info">
				{#if !isSelectingTarget}
					<h3 role="none" onclick={() => (isSelectingTarget = true)}>
						{currentTarget.name} (# {activeTargetIndex + 1})
					</h3>
				{:else}
					<Selector
						id="targetSelection"
						bind:value={selectedTarget}
						options={targets.map((_, i) => String(i))}
						optionsLabel={targets.map((t) => t.name)}
						onchange={() => changeTarget()}
					/>
				{/if}
				<div class="target-details">
					<span>{currentTarget.rule}</span>
					{#if currentTarget.rule !== 'Bonus'}
						<span>PAR {currentTarget.par}</span>
					{/if}
				</div>
			</div>
			<button class="btn-target" onclick={() => showNextTarget()}>▶</button>
		</header>

		<div class="scores-grid">
			<table>
				<tbody>
					{#if !individualRules.includes(currentTarget.rule || '')}
						{#each teams as team}
							{@const player = players.find((p) => p.id === team.playersId[0])}
							{#if player}
								<tr class="score">
									<td class="player-name">{team.name}</td>
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
											title="Echec">x</button
										>
									</td>
								</tr>
							{/if}
						{/each}
					{:else}
						{#each players as player}
							<tr class="score">
								<td class="player-name">{player.name}</td>
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
					{/if}
				</tbody>
			</table>
		</div>
	</div>

	<!-- Affichage de la carte de score -->
	<TeamScoreCardByTarget {rankedTeams} {targets} {players} settings={regulation} />
</div>
