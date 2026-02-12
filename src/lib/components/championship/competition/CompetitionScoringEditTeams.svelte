<script lang="ts">
	import type { Competition } from '$lib/types/competitionType';
	import type { Fly } from '$lib/types/flyType';
	import type { Course } from '$lib/types/courseType';
	import type { Target } from '$lib/types/targetsType';
	import type { Team } from '$lib/types/teamType';
	import type { Player } from '$lib/types/playerType';
	import type { RankedPlayer } from '$lib/types/playerType';
	import type { Regulations } from '$lib/types/regulationsType';
	import type { SessionSettings } from '$lib/types/gameSessionType';
	import { individualRules } from '$lib/types/targetsType';

	import { regulationsStore } from '$lib/stores/championship/regulationsStore.svelte';
	import { coursesChampionshipStore } from '$lib/stores/championship/coursesChampionshipStore.svelte';
	import { teamsChampionshipStore } from '$lib/stores/championship/teamsChampionshipStore.svelte';
	import { playersChampionshipStore } from '$lib/stores/championship/playersChampionshipStore.svelte';

	import { slide } from 'svelte/transition';
	import Stepper from '$lib/ui/Stepper.svelte';
	import TeamScoreCardByTarget from '$lib/ui/TeamScoreCardByTarget.svelte';
	import { getRankedTeams } from '$lib/utils/session/golfScoringFunction.svelte';
	import { onMount } from 'svelte';

	let { currentCompetition = $bindable(), currentFly = $bindable() } = $props<{
		currentCompetition: Competition | undefined;
		currentFly: Fly | undefined;
	}>();

	let rules: Regulations | undefined = $state();
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
	let settings: SessionSettings = {
		locationName: '',
		weatherCondition: '',
		sessionBeginning: '',
		hasCrossAFixedPenalty: true,
		malusOverPar: 4,
		malusValue: 10,
		teamGame: true,
		playersPerTeam: 2,
		usePenalizingGhost: false
	};
	let targets: Target[] = $derived(course?.targets || []);
	let rankedTeams = $derived(getRankedTeams(teams, targets, players, settings));

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

	function updateScoreTeam(team: Team, targetId: string, score: number) {
		team.playersId.forEach((playerId) => {
			if (players) {
				const player = players.find((p) => p.id === playerId);
				if (player) player.scores[targetId] = score;
			}
		});
	}

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
					{#if !individualRules.includes(currentTarget.rule || '')}
						{#each teams as team}
							{@const player = players.find((p) => p.id === team.playersId[0])}
							{#if player}
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
							{/if}
						{/each}
					{:else}
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
					{/if}
				</tbody>
			</table>
		</div>
	</div>

	<!-- Affichage de la carte de score -->
	<TeamScoreCardByTarget {rankedTeams} {targets} {players} {settings} />
</div>

<style>
</style>
