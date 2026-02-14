<script lang="ts">
	import { slide } from 'svelte/transition';
	import { playersStore } from '$lib/stores/quickSession/playersStore.svelte';
	import { teamsStore } from '$lib/stores/quickSession/teamsStore.svelte';
	import { targetsStore } from '$lib/stores/quickSession/targetsStore.svelte';
	import { sessionSettingsStore } from '$lib/stores/gameSessionStore.svelte';
	import { gameStatus } from '$lib/stores/gameStatusStore.svelte';
	import type { Team } from '$lib/types/teamType';
	import TeamScoreOrder from '$lib/ui/TeamScoreOrder.svelte';

	import { swipe } from '$lib/utils/swipe';
	import Stepper from '$lib/ui/Stepper.svelte';
	import { onMount } from 'svelte';
	import { getRankedTeams } from '$lib/utils/session/golfScoringFunction.svelte';

	const settings = sessionSettingsStore.settings;
	const scoringForAllPlayersRules = ['Bonus', 'Individuel'];

	let targets = $derived(targetsStore.list);
	let teams = $derived(teamsStore.list);
	let players = $derived(
		playersStore.list.filter((player) => teams.map((t) => t.playersId.includes(player.id)).flat())
	);
	let rankedTeams = $derived(getRankedTeams(teams, targets, players, settings.regulation));

	let activeTargetIndex = $derived(gameStatus.currentTargetIndex);

	let currentTarget = $derived(targets[activeTargetIndex]);
	let isFirstTarget = $derived(activeTargetIndex === 0);
	let isLastTarget = $derived(activeTargetIndex === targets.length - 1);
	let updatingPar: boolean = $state(false);
	let updatingRule: boolean = $state(false);

	let minTrys = $derived(currentTarget?.rule === 'Bonus' ? -3 : 0);
	let maxTrys = $derived(
		currentTarget?.rule === 'Bonus'
			? 0
			: settings.regulation.hasCrossAFixedPenalty
				? settings.regulation.malusValue
				: currentTarget.par + settings.regulation.malusOverPar
	);

	let showRanking: boolean = $state(false);

	const showNextTarget = () => {
		if (activeTargetIndex < targets.length - 1) {
			activeTargetIndex++;
			initScoresPlayerOnTarget();
		} else {
			alert("Il n'y a pas d'autres cibles");
		}
	};

	const showPrevTarget = () => {
		if (activeTargetIndex > 0) activeTargetIndex--;
	};

	const initScoresPlayerOnTarget = () => {
		playersStore.list.forEach((player) => {
			if (player.scores[currentTarget.id] === undefined) {
				player.scores[currentTarget.id] = currentTarget.par;
			}
		});
	};

	const updateScoreTeam = (team: Team, targetId: string, score: number) => {
		team.playersId.forEach((playerId) => {
			playersStore.updateScore(playerId, targetId, score);
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

<div class="step-content unselectable">
	<div
		role="none"
		onpointerdown={() => (showRanking = true)}
		onpointerup={() => (showRanking = false)}
		onpointerleave={() => (showRanking = false)}
		ontouchend={() => (showRanking = false)}
	>
		🔥 Provisoire
	</div>
	{#if showRanking}
		<TeamScoreOrder {rankedTeams} {targets} {players} settings={settings.regulation} />
	{/if}
</div>

<div class="progress-bar">
	<div class="fill" style="width: {(100 * (activeTargetIndex + 1)) / targets.length}%"></div>
</div>

<div class="step-content" in:slide>
	<header
		role="none"
		class="target-header"
		use:swipe={{ onRight: showNextTarget, onLeft: showPrevTarget }}
	>
		<button class="btn-target" onclick={() => showPrevTarget()} disabled={isFirstTarget}>◀</button>
		<div class="target-info">
			<h3>{currentTarget.name} (# {activeTargetIndex + 1})</h3>
			<div class="target-details">
				<span class="par-badge">{currentTarget.rule}</span>
				{#if !scoringForAllPlayersRules.includes(currentTarget.rule || '')}
					<span class="par-badge">PAR {currentTarget.par}</span>
				{/if}
			</div>
		</div>
		<button class="btn-target" onclick={() => showNextTarget()} disabled={isLastTarget}>▶</button>
	</header>

	<div class="scores-grid">
		<table>
			<tbody>
				{#if !scoringForAllPlayersRules.includes(currentTarget.rule || '')}
					{#each teams as team}
						{@const player = players.find((p) => p.id === team.playersId[0]) || {
							id: '',
							name: '',
							teamId: '',
							scores: {}
						}}
						<tr class="score">
							<td class="player-name">
								{team.name}
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
								&nbsp;&nbsp;
								<button
									class="btn-delete"
									onclick={() => updateScoreTeam(team, currentTarget.id, maxTrys)}
									title="Echec">x</button
								>
							</td>
						</tr>
					{/each}
				{:else}
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
				{/if}
			</tbody>
		</table>
	</div>
</div>
