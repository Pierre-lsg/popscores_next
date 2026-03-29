<script lang="ts">
	import { slide } from 'svelte/transition';
	import { playersStore } from '$lib/stores/quickSession/playersStore.svelte';
	import { teamsStore } from '$lib/stores/quickSession/teamsStore.svelte';
	import { targetsStore } from '$lib/stores/quickSession/targetsStore.svelte';
	import { sessionSettingsStore } from '$lib/stores/gameSessionStore.svelte';
	import { gameStatus } from '$lib/stores/gameStatusStore.svelte';
	import type { Team } from '$lib/types/teamType';
	import TeamScoreOrder from '$lib/ui/TeamScoreOrder.svelte';
	import TargetBox from '$lib/components/TargetBox.svelte';

	import { swipe } from '$lib/utils/swipe';
	import Stepper from '$lib/ui/Stepper.svelte';
	import Param from '$lib/ui/Param.svelte';
	import Selector from '$lib/ui/Selector.svelte';
	import TextField from '$lib/ui/TextField.svelte';
	import { onMount } from 'svelte';
	import { getRankedTeams } from '$lib/utils/session/golfScoringFunction.svelte';
	import { collectiveRules } from '$lib/types/targetType';

	const settings = sessionSettingsStore.settings;
	const scoringForAllPlayersRules = ['Bonus', 'Individuel'];
	const ruleOptions = collectiveRules;

	let targets = $derived(targetsStore.list);
	let teams = $derived(teamsStore.list);
	let players = $derived(
		playersStore.list.filter((player) => teams.map((t) => t.playersId.includes(player.id)).flat())
	);
	let rankedTeams = $derived(getRankedTeams(teams, targets, players, settings.regulation));

	//	let activeTargetIndex = $derived(gameStatus.currentTargetIndex);
	let activeTargetIndex = $state(0);

	let currentTarget = $derived(targets[activeTargetIndex]);
	let isFirstTarget = $derived(activeTargetIndex === 0);
	let isLastTarget = $derived(activeTargetIndex === targets.length - 1);
	let updatingPar: boolean = $state(false);
	let updatingRule: boolean = $state(false);
	let updatingName: boolean = $state(false);

	let minTrys = $derived(
		currentTarget?.rule === 'Bonus' || currentTarget?.rule === 'Team_Bonus' ? -3 : 0
	);
	let maxTrys = $derived(
		currentTarget?.rule === 'Bonus' || currentTarget?.rule === 'Team_Bonus'
			? 0
			: settings.regulation.hasCrossAFixedPenalty
				? settings.regulation.malusValue
				: currentTarget.par + settings.regulation.malusOverPar
	);

	let showRanking: boolean = $state(false);
	let showDetails: boolean = $state(false);

	const initScoresPlayerOnTarget = () => {
		playersStore.list.forEach((player) => {
			if (player.scores[currentTarget.id] === undefined) {
				player.scores[currentTarget.id] = currentTarget.par;
			}
		});
	};

	const showNextTarget = () => {
		modifyUpdatingBools('');

		if (activeTargetIndex < targets.length - 1) {
			activeTargetIndex++;
			initScoresPlayerOnTarget();
		} else {
			if (confirm('Voulez-vous ajouter une autre cible ?')) {
				//
				targetsStore.addTarget();
				activeTargetIndex++;
				initScoresPlayerOnTarget();
			}
		}
	};

	const showPrevTarget = () => {
		modifyUpdatingBools('');
		if (activeTargetIndex > 0) activeTargetIndex--;
	};

	const deleteTarget = () => {
		const targetIndex = activeTargetIndex;
		if (isFirstTarget === isLastTarget) {
			alert('Un parcours doit contenir au moins un trou');
			return;
		}
		if (isLastTarget) activeTargetIndex = activeTargetIndex - 1;

		if (confirm('Voulez-vous annuler la cible ?')) {
			targetsStore.remove(targetIndex);
		}
	};

	const updateScoreTeam = (team: Team, targetId: string, score: number) => {
		team.playersId.forEach((playerId) => {
			playersStore.updateScore(playerId, targetId, score);
		});
	};

	const modifyUpdatingBools = (updatedField: string) => {
		updatingPar = updatedField === 'par' ? !updatingPar : false;
		updatingRule = updatedField === 'rule' ? !updatingRule : false;
		updatingName = updatedField === 'name' ? !updatingName : false;
	};

	const updateTargetRule = () => {
		if (
			!confirm("La règle 'Bonus' nécessite de réinitialiser les scores.\n Voulez-vous continuer ?")
		) {
			currentTarget.rule = 'Individuel';
			return;
		}
		currentTarget.par =
			currentTarget.rule === 'Bonus' || currentTarget.rule === 'Team_Bonus' ? 0 : 4;
		players.forEach((player) => {
			playersStore.updateScore(player.id, currentTarget.id, currentTarget.par);
		});
	};

	onMount(() => {
		initScoresPlayerOnTarget();
	});
</script>

<div class="step-content">
	<div class="action">
		<div
			class="unselectable"
			role="none"
			onpointerdown={() => (showRanking = true)}
			onpointerup={() => (showRanking = false)}
			onpointerleave={() => (showRanking = false)}
			ontouchend={() => (showRanking = false)}
		>
			🔥 Provisoire
		</div>
		<div role="none" onclick={() => deleteTarget()} class="btn-delete-small">X</div>
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
			<h3>
				<TextField bind:value={currentTarget.name} />&nbsp;(#&nbsp;{activeTargetIndex + 1})
			</h3>
			<div class="target-details">
				<span role="none" class="par-badge" onclick={() => modifyUpdatingBools('rule')}
					>{currentTarget.rule}</span
				>
				{#if currentTarget.rule !== 'Bonus' && currentTarget.rule !== 'Team_Bonus'}
					<span role="none" class="par-badge" onclick={() => modifyUpdatingBools('par')}
						>PAR {currentTarget.par}</span
					>
				{/if}
				<span role="none" class="par-badge" onclick={() => (showDetails = !showDetails)}>?</span>
			</div>
		</div>
		<button class="btn-target" onclick={() => showNextTarget()} disabled={isLastTarget}>▶</button>
	</header>

	{#if showDetails}
		<TargetBox target={currentTarget} bind:showDetails />
	{/if}

	{#if updatingPar}
		<Stepper
			label="Modification du Par : "
			bind:value={currentTarget.par}
			min={0}
			disabled={currentTarget.rule === 'Bonus' || currentTarget.rule === 'Team_Bonus'}
		/>
	{/if}

	{#if updatingName}
		<Param label="Nom de la cible" bind:value={currentTarget.name} oneline={true} focus={true} />
	{/if}

	{#if updatingRule}
		<Selector
			id="rule{currentTarget.id}"
			bind:value={currentTarget.rule}
			label="Modification de la règle :"
			options={ruleOptions}
			onchange={() => updateTargetRule()}
		/>
	{/if}

	<div class="scores-grid">
		<table>
			<tbody>
				{#if !scoringForAllPlayersRules.includes(currentTarget.rule || '')}
					{#each teams as team}
						{@const player = players.find((p) => p.id === team.playersId[0])}
						{#if player}
							<tr class="score">
								<td class="player-name">
									{team.name}
								</td>
								<td>
									<Stepper
										value={player.scores[currentTarget.id]}
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
						{/if}
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

<style>
	h3 {
		display: flex;
		width: 100%;
		align-items: center;
		justify-content: center;
	}
</style>
