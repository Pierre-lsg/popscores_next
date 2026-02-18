<script lang="ts">
	import type { Competition } from '$lib/types/competitionType';
	import CompetitionSettings from './CompetitionSettings.svelte';
	import CompetitionCourse from './CompetitionCourse.svelte';
	import CompetitionFollowing from './CompetitionFollowing.svelte';
	import CompetitionPlayers from './CompetitionPlayers.svelte';
	import CompetitionScoring from './CompetitionScoring.svelte';
	import CompetitionStarting from './CompetitionStarting.svelte';
	import CompetitionGreetings from './CompetitionGreetings.svelte';

	import CompetitionMenu from './CompetitionMenu.svelte';
	import { onMount } from 'svelte';

	let { currentCompetition = $bindable(), csId } = $props<{
		currentCompetition: Competition | undefined;
		csId: string;
	}>();

	onMount(() => {
		// for debug
	});
</script>

<div>
	{#if currentCompetition.step === 'welcome'}
		<CompetitionMenu bind:currentCompetition />
		<h2>Suivi d'une compétition</h2>
		<p>Gestion de la compétition sélectionnée : {currentCompetition.name}</p>
		{#if currentCompetition.status === 'setup'}
			Veuillez définir les paramètres de la compétition
		{/if}
		{#if currentCompetition.status === 'in_progress'}
			Compétition en cours. Vous pouvez saisir les scores, observer le déroulement ou récupérer les
			cartes de score.
		{/if}
		{#if currentCompetition.status === 'finished'}
			Compétition en terminé. Calculons le podium
		{/if}

		<p>Que voulez-vous faire ?</p>
	{/if}

	{#if currentCompetition.status === 'setup'}
		{#if currentCompetition.step === 'settings'}
			<CompetitionSettings bind:currentCompetition />
		{/if}
		{#if currentCompetition.step === 'course'}
			<CompetitionCourse bind:currentCompetition />
		{/if}
		{#if currentCompetition.step === 'players'}
			<CompetitionPlayers bind:currentCompetition />
		{/if}
		{#if currentCompetition.step === 'starting'}
			<CompetitionStarting bind:currentCompetition />
		{/if}
	{/if}

	{#if currentCompetition.status === 'in_progress'}
		{#if currentCompetition.step === 'course'}
			<CompetitionCourse bind:currentCompetition />
		{/if}
		{#if currentCompetition.step === 'scoring'}
			<CompetitionScoring bind:currentCompetition />
		{/if}
		{#if currentCompetition.step === 'following'}
			<CompetitionFollowing bind:currentCompetition />
		{/if}
	{/if}

	{#if currentCompetition.status === 'finished'}
		{#if currentCompetition.step === 'greeting'}
			<CompetitionGreetings bind:currentCompetition />
		{/if}
	{/if}
</div>
