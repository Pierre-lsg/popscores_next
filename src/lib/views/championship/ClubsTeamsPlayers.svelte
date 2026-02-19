<script lang="ts">
	import ClubsList from '$lib/components/championship/club/ClubsList.svelte';
	import ClubManagement from '$lib/components/championship/club/ClubManagement.svelte';
	import ClubManagementNoClub from '$lib/components/championship/club/ClubManagementNoClub.svelte';
	import { championshipStore } from '$lib/stores/championship/championshipsStore.svelte';

	let championship = $state(championshipStore.list[0]);

	let currentClub: string = $state('');
</script>

<div class="mobile-wizard">
	{#if currentClub === ''}
		<!-- Gestion des clubs -->
		<ClubsList bind:currentClub {championship} />
	{:else if currentClub !== 'no_club'}
		<!-- Suivi d'un club -->
		<ClubManagement bind:currentClub {championship} />
	{:else}
		<ClubManagementNoClub bind:currentClub {championship} />
	{/if}
</div>
