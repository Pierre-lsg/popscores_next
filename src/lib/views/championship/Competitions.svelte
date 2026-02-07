<script lang="ts">
	import CompetitionManagement from '$lib/components/championship/CompetitionManagement.svelte';
	import CompetitionsList from '$lib/components/championship/CompetitionsList.svelte';
	import { championshipStore } from '$lib/stores/championship/championshipsStore.svelte';

	let csStore = $state(championshipStore.list[0]);

	let currentCompetition: string = $state('');
</script>

{#if currentCompetition === ''}
	<!-- Gestion des compétitions -->
	<CompetitionsList bind:currentCompetition csId={csStore.id} />
{:else}
	<!-- Suivi d'une compétition -->
	<CompetitionManagement bind:currentCompetition csId={csStore.id} />
{/if}
