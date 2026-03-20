<script lang="ts">
	import CompetitionManagement from '$lib/components/championship/competition/CompetitionManagement.svelte';
	import CompetitionsList from '$lib/components/championship/competition/CompetitionsList.svelte';
	import { championshipStore } from '$lib/stores/championship/championshipsStore.svelte';
	import type { Competition } from '$lib/types/competitionType';
	import { selection } from '$lib/stores/selection';
	import type { Championship } from '$lib/types/championshipType';

	let championship = $state(selection.currentChampionship || ({} as Championship));
	//	let championship = $state(championshipStore.list[0]);

	let currentCompetition: Competition | undefined = $state();
</script>

{#if currentCompetition === undefined}
	<!-- Gestion des compétitions -->
	<CompetitionsList bind:currentCompetition bind:championship />
{:else}
	<!-- Suivi d'une compétition -->
	<CompetitionManagement bind:currentCompetition bind:championship />
{/if}
