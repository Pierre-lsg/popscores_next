<script lang="ts">
	import ClubsList from '$lib/components/championship/club/ClubsList.svelte';
	import ClubManagement from '$lib/components/championship/club/ClubManagement.svelte';
	import ClubManagementNoClub from '$lib/components/championship/club/ClubManagementNoClub.svelte';
	import type { Championship } from '$lib/types/championshipType';
	import { selection } from '$lib/stores/selection';

	let championship = selection.currentChampionship || ({} as Championship);

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
