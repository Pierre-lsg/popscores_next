<script lang="ts">
	import type { Competition } from '$lib/types/competitionType';
	import CompetitionGreetingsSolo from './CompetitionGreetingsSolo.svelte';
	import CompetitionGreetingsTeams from './CompetitionGreetingsTeams.svelte';
	import CompetitionMenu from './CompetitionMenu.svelte';
	import { isCompetitionTeam } from '$lib/utils/championship/competitionsFunctions.svelte';

	let { currentCompetition = $bindable() } = $props<{
		currentCompetition: Competition | undefined;
	}>();
</script>

<div>
	<CompetitionMenu bind:currentCompetition />
	<h2>Valider la compétition et partager</h2>

	{#if isCompetitionTeam(currentCompetition)}
		<!-- Compétition en équipe -->
		<CompetitionGreetingsTeams {currentCompetition} />
	{:else}
		<!-- Compétition individuelle -->
		<CompetitionGreetingsSolo {currentCompetition} />
	{/if}
</div>
