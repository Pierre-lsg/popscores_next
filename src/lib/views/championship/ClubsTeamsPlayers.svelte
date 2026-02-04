<script lang="ts">
	import ClubsList from '$lib/components/championship/ClubsList.svelte';
	import ClubManagement from '$lib/components/championship/ClubManagement.svelte';
	import { championshipStore } from '$lib/stores/championship/championshipsStore.svelte';

	let csStore = $state(championshipStore.list[0]);

	let currentClub: string = $state('');
</script>

<div class="mobile-wizard">
	<ul>
		<li>Lister les joueurs sans club</li>
	</ul>

	{#if currentClub === ''}
		<!-- Gestion des clubs -->
		<ClubsList bind:currentClub csId={csStore.id} />
	{:else}
		<!-- Suivi d'un club -->
		<ClubManagement bind:currentClub csId={csStore.id} />
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
