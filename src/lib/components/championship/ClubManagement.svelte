<script lang="ts">
	import { clubsStore } from '$lib/stores/championship/clubsStore.svelte';

	import PlayersManagement from './PlayersManagement.svelte';
	import TeamsManagement from './TeamsManagement.svelte';

	import type { Club } from '$lib/types/clubType';

	let { currentClub = $bindable('') } = $props<{
		currentClub: string;
	}>();

	let club: Club = clubsStore.list.filter((c) => c.id === currentClub)[0];
</script>

<p>Club : {club.name}</p>

<button onclick={() => (currentClub = '')}> Retour à la liste des clubs </button>

<p>Liste des joueurs</p>

<PlayersManagement bind:currentClub />

<p>Liste des équipes</p>

<TeamsManagement bind:currentClub />
