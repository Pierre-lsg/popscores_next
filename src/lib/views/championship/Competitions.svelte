<script lang="ts">
	import CompetitionManagement from './CompetitionManagement.svelte';
	import CompetitionsList from '$lib/components/championship/CompetitionsList.svelte';

	let currentCompetition: string = $state('');
</script>

<div class="mobile-wizard">
	{#if currentCompetition === ''}
		<!-- Gestion des compétitions -->
		<CompetitionsList bind:currentCompetition />
	{:else}
		<!-- Suivi d'une compétition -->
		<CompetitionManagement bind:currentCompetition />
	{/if}
</div>

<style>
	.mobile-wizard {
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
</style>
