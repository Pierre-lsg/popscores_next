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

	let isShowingPlayers = $state(true);
	let isShowingTeams = $state(true);
	let playersDisp = $state('réduire');
	let teamsDisp = $state('réduire');

	const showPlayers = () => {
		isShowingPlayers = !isShowingPlayers;
		playersDisp = isShowingPlayers ? 'réduire' : 'développer';
	};

	const showTeams = () => {
		isShowingTeams = !isShowingTeams;
		teamsDisp = isShowingTeams ? 'réduire' : 'développer';
	};
</script>

<button onclick={() => (currentClub = '')} class="subnav"> Retour à la liste des clubs </button>

<h2>Club : {club.name}</h2>

<div>
	Liste des joueurs
	<span role="none" onclick={() => showPlayers()} class="action">{playersDisp}</span>
</div>

{#if isShowingPlayers}
	<PlayersManagement bind:currentClub />
{/if}

<div>
	Liste des équipes
	<span role="none" onclick={() => showTeams()} class="action">{teamsDisp}</span>
</div>

{#if isShowingTeams}
	<TeamsManagement bind:currentClub />
{/if}

<style>
	.action {
		font-size: x-small;
	}
</style>
