<script lang="ts">
	import type { Competition } from '$lib/types/competitionType';
	import type { Championship } from '$lib/types/championshipType';
	import type { Fly } from '$lib/types/flyType';
	import CompetitionScoringList from './CompetitionScoringList.svelte';
	import CompetitionScoringEditSolo from './CompetitionScoringEditSolo.svelte';
	import CompetitionScoringEditTeams from './CompetitionScoringEditTeams.svelte';
	import { isCompetitionTeam } from '$lib/utils/championship/competitionsFunctions.svelte';
	import '$lib/styles/golfScoring.css';

	let { currentCompetition = $bindable(), championship = $bindable() } = $props<{
		currentCompetition: Competition | undefined;
		championship: Championship;
	}>();

	let currentFly: Fly | undefined = $state();
</script>

{#if currentFly === undefined}
	<!-- Gestion des compétitions -->
	<CompetitionScoringList bind:currentCompetition bind:championship bind:currentFly />
{:else}
	<!-- Suivi d'une compétition -->
	{#if isCompetitionTeam(currentCompetition)}
		<CompetitionScoringEditTeams bind:currentCompetition bind:currentFly />
	{:else}
		<CompetitionScoringEditSolo bind:currentCompetition bind:currentFly />
	{/if}
{/if}
