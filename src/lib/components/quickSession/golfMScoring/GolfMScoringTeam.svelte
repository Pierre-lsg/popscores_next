<script lang="ts">
	import { slide } from 'svelte/transition';
	import { playersStore } from '$lib/stores/quickSession/playersStore.svelte';
	import { teamsStore } from '$lib/stores/quickSession/teamsStore.svelte';
	import { targetsStore } from '$lib/stores/quickSession/targetsStore.svelte';
	import { sessionSettingsStore } from '$lib/stores/gameSessionStore.svelte';
	import { gameStatus } from '$lib/stores/gameStatusStore.svelte';
	import type { Team } from '$lib/types/teamType';

	import { swipe } from '$lib/utils/swipe';
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

	// --
	// Code pour gestion du Swipe
	// Todo: à refactoriser car utilisé ailleurs

	const showNextTarget = () => {
		if (activeTargetIndex < targetsStore.list.length) activeTargetIndex++;
		else alert("Il n'y a pas d'autres cibles");
		initScoresPlayerOnTarget();
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
	<header
		role="none"
		class="target-header"
		use:swipe={{ onRight: showNextTarget, onLeft: showPrevTarget }}
	>
		<button onclick={() => showPrevTarget()} disabled={isFirstTarget}>◀</button>
		<div class="target-info">
			<h3>{currentTarget.name} (# {activeTargetIndex + 1})</h3>
			<div class="target-details">
				<span class="par-badge">{currentTarget.rule}</span>
				{#if !scoringForAllPlayersRules.includes(currentTarget.rule || '')}
					<span class="par-badge">PAR {currentTarget.par}</span>
				{/if}
			</div>
		</div>
		<button onclick={() => showNextTarget()} disabled={isLastTarget}>▶</button>
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
