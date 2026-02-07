<script lang="ts">
	import { clubsStore } from '$lib/stores/championship/clubsStore.svelte';

	import PlayersManagement from './PlayersManagement.svelte';
	import TeamsManagement from './TeamsManagement.svelte';

	import type { Club } from '$lib/types/clubType';

	let { currentClub = $bindable(''), csId } = $props<{
		currentClub: string;
		csId: string;
	}>();

	let club: Club = clubsStore.list.filter((c) => c.id === currentClub)[0];

	let showPlayers = $state(true);
	let showTeams = $state(true);
</script>

<button onclick={() => (currentClub = '')} class="subnav"> Retour à la liste des clubs </button>

<h2>Club : {club.name}</h2>

<p role="none" onclick={() => (showPlayers = !showPlayers)}>Liste des joueurs</p>

{#if showPlayers}
	<PlayersManagement bind:currentClub />
{/if}

<p role="none" onclick={() => (showTeams = !showTeams)}>Liste des équipes</p>

{#if showTeams}
	<TeamsManagement bind:currentClub />
{/if}
