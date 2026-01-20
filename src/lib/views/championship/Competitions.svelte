<script lang="ts">
	import { gameStatus } from '$lib/stores/gameStatusStore.svelte';
	import { onMount } from 'svelte';
	import CompetitionManagement from './CompetitionManagement.svelte';
	import CompetitionsList from '$lib/components/championship/CompetitionsList.svelte';

	let currentCompetition: string = '';
</script>

<div class="mobile-wizard">
	<h2>Compétitions de championnat</h2>
	<p>Cette section permettra de gérer les compétitions de championnat à venir.</p>
	<ul>
		<li>Lister les compétitions</li>
		<li>Créer / éditer une compétition</li>
		<li>Suivre une compétition en cours</li>
	</ul>

	{#if currentCompetition === ''}
		<!-- Gestion des compétitions -->
		<CompetitionsList {currentCompetition} />
	{:else}
		<!-- Suivi d'une compétition -->
		<CompetitionManagement />
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
