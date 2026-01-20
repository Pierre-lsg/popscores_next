<script lang="ts">
	import { gameStatus } from '$lib/stores/gameStatusStore.svelte';
	import { onMount } from 'svelte';
	import CompetitionManagement from './CompetitionManagement.svelte';
	import CompetitionsList from '$lib/components/championship/CompetitionsList.svelte';

	let currentCompetition: string = '';
</script>

<div class="mobile-wizard">
	<h2>Liste des clubs</h2>
	<p>Cette section permettra de gérer les clubs de championnat à venir.</p>
	<ul>
		<li>Lister les clubs</li>
		<li>Pour chaque club si sélectionné lister les équipes et les joueurs</li>
		<li>Lister les joueurs sans club</li>
	</ul>

	<CompetitionsList {currentCompetition} />
</div>

<style>
	.mobile-wizard {
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
</style>
