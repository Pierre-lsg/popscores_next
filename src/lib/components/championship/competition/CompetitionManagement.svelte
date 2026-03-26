<script lang="ts">
	import type { Competition } from '$lib/types/competitionType';
	import type { Championship } from '$lib/types/championshipType';

	import CompetitionSettings from './CompetitionSettings.svelte';
	import CompetitionCourse from './CompetitionCourse.svelte';
	import CompetitionFollowing from './CompetitionFollowing.svelte';
	import CompetitionPlayers from './CompetitionPlayers.svelte';
	import CompetitionScoring from './CompetitionScoring.svelte';
	import CompetitionStarting from './CompetitionStarting.svelte';
	import CompetitionGreetings from './CompetitionGreetings.svelte';
	import CompetitionSummary from './CompetitionSummary.svelte';

	import CompetitionMenu from './CompetitionMenu.svelte';

	let { currentCompetition = $bindable(), championship = $bindable() } = $props<{
		currentCompetition: Competition | undefined;
		championship: Championship;
	}>();
</script>

<div>
	{#if currentCompetition.step === 'welcome'}
		<CompetitionMenu bind:currentCompetition />
		<h2>Suivi de la compétition</h2>
		<h3>{currentCompetition.name}</h3>
		{#if currentCompetition.status === 'setup'}
			<CompetitionSummary bind:currentCompetition bind:championship />
		{/if}
		{#if currentCompetition.status === 'in_progress'}
			Compétition en cours. Vous pouvez saisir les scores, observer le déroulement ou récupérer les
			cartes de score.
		{/if}
		{#if currentCompetition.status === 'finished'}
			Compétition en terminé. Calculons le podium
		{/if}
	{/if}

	{#if currentCompetition.status === 'setup'}
		{#if currentCompetition.step === 'settings'}
			<CompetitionSettings bind:currentCompetition />
		{/if}
		{#if currentCompetition.step === 'course'}
			<CompetitionCourse bind:currentCompetition />
		{/if}
		{#if currentCompetition.step === 'players'}
			<CompetitionPlayers bind:currentCompetition bind:championship />
		{/if}
		{#if currentCompetition.step === 'starting'}
			<CompetitionStarting bind:currentCompetition bind:championship />
		{/if}
	{/if}

	{#if currentCompetition.status === 'in_progress'}
		{#if currentCompetition.step === 'course'}
			<CompetitionCourse bind:currentCompetition />
		{/if}
		{#if currentCompetition.step === 'scoring'}
			<CompetitionScoring bind:currentCompetition bind:championship />
		{/if}
		{#if currentCompetition.step === 'following'}
			<CompetitionFollowing bind:currentCompetition />
		{/if}
	{/if}

	{#if currentCompetition.status === 'finished'}
		{#if currentCompetition.step === 'greeting'}
			<CompetitionGreetings bind:currentCompetition />
		{/if}
		{#if currentCompetition.step === 'welcome'}
			🍺🍺🍺🍺🍺🍺
		{/if}
	{/if}
</div>
