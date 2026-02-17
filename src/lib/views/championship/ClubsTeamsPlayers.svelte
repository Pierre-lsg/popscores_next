<script lang="ts">
	import ClubsList from '$lib/components/championship/ClubsList.svelte';
	import ClubManagement from '$lib/components/championship/ClubManagement.svelte';
	import ClubManagementNoClub from '$lib/components/championship/ClubManagementNoClub.svelte';
	import { championshipStore } from '$lib/stores/championship/championshipsStore.svelte';

	let csStore = $state(championshipStore.list[0]);

	let currentClub: string = $state('');
</script>

<div class="mobile-wizard">
	{#if currentClub === ''}
		<!-- Gestion des clubs -->
		<ClubsList bind:currentClub csId={csStore.id} />
	{:else if currentClub !== 'no_club'}
		<!-- Suivi d'un club -->
		<ClubManagement bind:currentClub csId={csStore.id} />
	{:else}
		<ClubManagementNoClub bind:currentClub csId={csStore.id} />
	{/if}
</div>
