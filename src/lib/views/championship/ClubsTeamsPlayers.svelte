<script lang="ts">
	import ClubsList from '$lib/components/championship/ClubsList.svelte';
	import ClubManagement from '$lib/components/championship/ClubManagement.svelte';

	let currentClub: string = $state('');
</script>

<div class="mobile-wizard">
	<h2>Liste des clubs</h2>
	<p>Cette section permettra de gérer les clubs de championnat à venir.</p>
	<ul>
		<li>Lister les clubs</li>
		<li>Pour chaque club si sélectionné lister les équipes et les joueurs</li>
		<li>Lister les joueurs sans club</li>
	</ul>

	<p>Club en cours : {currentClub}</p>

	{#if currentClub === ''}
		<!-- Gestion des clubs -->
		<ClubsList bind:currentClub />
	{:else}
		<!-- Suivi d'un club -->
		<ClubManagement bind:currentClub />
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
