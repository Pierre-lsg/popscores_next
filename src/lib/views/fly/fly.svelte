<script lang="ts">
	import type { Competition } from '$lib/types/competitionType';
	import type { Fly } from '$lib/types/flyType';
	import CompetitionScoringEditSolo from '$lib/components/championship/competition/CompetitionScoringEditSolo.svelte';
	import CompetitionScoringEditTeams from '$lib/components/championship/competition/CompetitionScoringEditTeams.svelte';
	import { isCompetitionTeam } from '$lib/utils/championship/competitionsFunctions.svelte';
	import '$lib/styles/golfScoring.css';

	let { currentCompetition, currentFly } = $props<{
		currentCompetition: Competition;
		currentFly: Fly;
	}>();
</script>

<!-- Suivi d'une compétition -->
{#if isCompetitionTeam(currentCompetition)}
	<CompetitionScoringEditTeams bind:currentCompetition bind:currentFly />
{:else}
	<CompetitionScoringEditSolo bind:currentCompetition bind:currentFly />
{/if}
