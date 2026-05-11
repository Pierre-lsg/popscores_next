<script lang="ts">
	import { slide } from 'svelte/transition';
	import { playersStore } from '$lib/stores/quickSession/playersStore.svelte';
	import { targetsStore } from '$lib/stores/quickSession/targetsStore.svelte';
	import { sessionSettingsStore } from '$lib/stores/gameSessionStore.svelte';
	import { gameStatus } from '$lib/stores/gameStatusStore.svelte';
	import PlayerScoreOrder from '$lib/components/core_game/PlayerScoreOrder.svelte';
	import ScoreHeader from '$lib/components/core_game/scoring/ScoreHeader.svelte';
	import ScoreGrid from '$lib/components/core_game/scoring/ScoreGrid.svelte';

	import { individualRules } from '$lib/types/targetType';

	import Stepper from '$lib/ui/Stepper.svelte';
	import Selector from '$lib/ui/Selector.svelte';
	import Param from '$lib/ui/Param.svelte';
	import { toastStore } from '$lib/stores/toastStore.svelte';

	import { swipe } from '$lib/utils/swipe';
	import { onMount } from 'svelte';
	import { getRankedPlayers, getPlayerStats } from '$lib/utils/session/golfScoringFunction.svelte';

	const settings = sessionSettingsStore.settings;
	const ruleOptions = individualRules;
	let targets = $derived(targetsStore.list);
	let players = $derived(playersStore.list);

	// let activeTargetIndex = $derived(gameStatus.currentTargetIndex);
	let activeTargetIndex = $state(0);

	let rankedPlayers = $derived(getRankedPlayers(players, targets));

	let currentTarget = $derived(targets[activeTargetIndex]);
	let isFirstTarget = $derived(activeTargetIndex === 0);
	let isLastTarget = $derived(activeTargetIndex === targets.length - 1);
	let updatingPar: boolean = $state(false);
	let updatingRule: boolean = $state(false);
	let updatingName: boolean = $state(false);

	let minTrys = $derived(currentTarget?.rule === 'Bonus' ? -3 : 0);
	let maxTrys = $derived(
		currentTarget?.rule === 'Bonus'
			? 0
			: settings.regulation.hasCrossAFixedPenalty
				? settings.regulation.malusValue
				: currentTarget.par + settings.regulation.malusOverPar
	);

	let showRanking: boolean = $state(false);

	const initScoresPlayerOnTarget = () => {
		players.forEach((player) => {
			if (player.scores[currentTarget.id] === undefined) {
				playersStore.updateScore(player.id, currentTarget.id, currentTarget.par);
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

	const modifyUpdatingBools = (updatedField: string) => {
		updatingPar = updatedField === 'par' ? !updatingPar : false;
		updatingRule = updatedField === 'rule' ? !updatingRule : false;
		updatingName = updatedField === 'name' ? !updatingName : false;
	};

	const deleteTarget = () => {
		const targetIndex = activeTargetIndex;
		if (isFirstTarget === isLastTarget) {
			toastStore.show('Un parcours doit contenir au moins un trou', 'failure', 0);
			return;
		}
		if (isLastTarget) activeTargetIndex = activeTargetIndex - 1;

		if (confirm('Voulez-vous annuler la cible ?')) {
			targetsStore.remove(targetIndex);
		}
	};

	const updateTargetRule = () => {
		if (
			!confirm("La règle 'Bonus' nécessite de réinitialiser les scores.\n Voulez-vous continuer ?")
		) {
			currentTarget.rule = 'Individuel';
			return;
		}
		currentTarget.par = currentTarget.rule === 'Bonus' ? 0 : 4;
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
		<PlayerScoreOrder {rankedPlayers} {targets} />
	{/if}
</div>

<div class="progress-bar">
	<div class="fill" style="width: {(100 * (activeTargetIndex + 1)) / targets.length}%"></div>
</div>

<div class="step-content" in:slide>
	<ScoreHeader
		bind:target={currentTarget}
		{targets}
		{activeTargetIndex}
		{isFirstTarget}
		{isLastTarget}
		allowEdit={true}
		onNext={showNextTarget}
		onPrev={showPrevTarget}
		onModifyPar={() => modifyUpdatingBools('par')}
		onModifyRule={() => modifyUpdatingBools('rule')}
	/>

	{#if updatingPar}
		<Stepper
			label="Modification du Par : "
			bind:value={currentTarget.par}
			min={0}
			disabled={currentTarget.rule === 'Bonus'}
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

	<ScoreGrid
		target={currentTarget}
		{players}
		{minTrys}
		{maxTrys}
		onScoreChange={(playerId, targetId, score) =>
			playersStore.updateScore(playerId, targetId, score)}
	/>
</div>

<style>
	h3 {
		display: flex;
		width: 100%;
		align-items: center;
		justify-content: center;
	}
</style>
