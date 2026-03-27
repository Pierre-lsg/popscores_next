<script lang="ts">
	import type { Competition } from '$lib/types/competitionType';
	import type { Championship } from '$lib/types/championshipType';
	import CompetitionGreetingsSolo from './CompetitionGreetingsSolo.svelte';
	import CompetitionGreetingsTeams from './CompetitionGreetingsTeams.svelte';
	import CompetitionMenu from './CompetitionMenu.svelte';
	import { isCompetitionTeam } from '$lib/utils/championship/competitionsFunctions.svelte';

	let { currentCompetition = $bindable(), championship = $bindable() } = $props<{
		currentCompetition: Competition | undefined;
		championship: Championship;
	}>();
</script>

<div>
	<CompetitionMenu bind:currentCompetition />
	<h2>Valider la compétition et partager</h2>

	{#if isCompetitionTeam(currentCompetition)}
		<!-- Compétition en équipe -->
		<CompetitionGreetingsTeams bind:currentCompetition bind:championship />
	{:else}
		<!-- Compétition individuelle -->
		<CompetitionGreetingsSolo bind:currentCompetition bind:championship />
	{/if}
</div>
