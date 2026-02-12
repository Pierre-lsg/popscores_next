<script lang="ts">
	import type { Competition } from '$lib/types/competitionType';
	import type { Fly } from '$lib/types/flyType';
	import CompetitionScoringEdit from './CompetitionScoringEdit.svelte';
	import CompetitionScoringList from './CompetitionScoringList.svelte';

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
	<CompetitionScoringEdit bind:currentCompetition bind:currentFly />
{/if}
