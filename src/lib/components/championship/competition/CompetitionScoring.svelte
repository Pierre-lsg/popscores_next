<script lang="ts">
	import type { Competition } from '$lib/types/competitionType';
	import type { Fly } from '$lib/types/flyType';
	import CompetitionScoringList from './CompetitionScoringList.svelte';
	import CompetitionScoringEditSolo from './CompetitionScoringEditSolo.svelte';
	import CompetitionScoringEditTeams from './CompetitionScoringEditTeams.svelte';
	import { isCompetitionTeam } from '$lib/utils/championship/competitionsFunctions.svelte';
	import '$lib/styles/golfScoring.css';

	let { currentCompetition = $bindable() } = $props<{
		currentCompetition: Competition | undefined;
	}>();

	let currentFly: Fly | undefined = $state();
</script>

{#if currentFly === undefined}
	<!-- Gestion des compétitions -->
	<CompetitionScoringList bind:currentCompetition bind:currentFly />
{:else}
	<!-- Suivi d'une compétition -->
	{#if isCompetitionTeam(currentCompetition)}
		<CompetitionScoringEditTeams bind:currentCompetition bind:currentFly />
	{:else}
		<CompetitionScoringEditSolo bind:currentCompetition bind:currentFly />
	{/if}
{/if}
