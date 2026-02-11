<script lang="ts">
	import type { Competition } from '$lib/types/competitionType';
	import { competitionStatus } from '$lib/stores/championship/competitionStatusStore.svelte';
	import CompetitionSettings from './CompetitionSettings.svelte';
	import CompetitionCourse from './CompetitionCourse.svelte';
	import CompetitionFollowing from './CompetitionFollowing.svelte';
	import CompetitionPlayers from './CompetitionPlayers.svelte';
	import CompetitionScoring from './CompetitionScoring.svelte';
	import CompetitionStarting from './CompetitionStarting.svelte';
	import CompetitionGreetings from './CompetitionGreetings.svelte';

	import CompetitionMenu from './CompetitionMenu.svelte';

	let { currentCompetition = $bindable(), csId } = $props<{
		currentCompetition: Competition | undefined;
		csId: string;
	}>();
</script>

<div>
	{#if competitionStatus.action === 'welcome'}
		<CompetitionMenu bind:currentCompetition />
		<h2>Suivi d'une compétition</h2>
		<p>Gestion de la compétition sélectionnée : {currentCompetition.name}</p>
		{#if competitionStatus.status === 'setup'}
			Veuillez définir les paramètres de la compétition
		{/if}
		{#if competitionStatus.status === 'in_progress'}
			Compétition en cours. Vous pouvez saisir les scores, observer le déroulement ou récupérer les
			cartes de score.
		{/if}
		{#if competitionStatus.status === 'finished'}
			Compétition en terminé. Calculons le podium
		{/if}

		<p>Que voulez-vous faire ?</p>
	{/if}

	{#if competitionStatus.status === 'setup'}
		{#if competitionStatus.action === 'settings'}
			<CompetitionSettings bind:currentCompetition />
		{/if}
		{#if competitionStatus.action === 'course'}
			<CompetitionCourse bind:currentCompetition />
		{/if}
		{#if competitionStatus.action === 'players'}
			<CompetitionPlayers bind:currentCompetition />
		{/if}
		{#if competitionStatus.action === 'starting'}
			<CompetitionStarting bind:currentCompetition />
		{/if}
	{/if}

	{#if competitionStatus.status === 'in_progress'}
		{#if competitionStatus.action === 'course'}
			<CompetitionCourse bind:currentCompetition />
		{/if}
		{#if competitionStatus.action === 'scoring'}
			<CompetitionScoring bind:currentCompetition />
		{/if}
		{#if competitionStatus.action === 'following'}
			<CompetitionFollowing bind:currentCompetition />
		{/if}
	{/if}

	{#if competitionStatus.status === 'finished'}
		{#if competitionStatus.action === 'greeting'}
			<CompetitionGreetings bind:currentCompetition />
		{/if}
	{/if}
</div>
