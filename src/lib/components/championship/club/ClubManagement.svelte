<script lang="ts">
	import { clubsStore } from '$lib/stores/championship/clubsStore.svelte';

	import PlayersManagement from './PlayersManagement.svelte';
	import TeamsManagement from './TeamsManagement.svelte';
	import type { Club } from '$lib/types/clubType';
	import type { Championship } from '$lib/types/championshipType';
	import { navContext } from '$lib/utils/nav.svelte';
	import { onMount } from 'svelte';
	import { base } from '$app/paths';
	import { selection } from '$lib/stores/selection';

	let { currentClub = $bindable(''), championship } = $props<{
		currentClub: string;
		championship: Championship;
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

	onMount(() => {
		navContext.headerAction = returnButton;
		return () => (navContext.headerAction = prevReturnButton);
	});
</script>

{#snippet returnButton()}
	<div class="btn btn-back" role="none" onclick={() => (currentClub = '')}>👥 Accueil</div>
{/snippet}

{#snippet prevReturnButton()}
	<a class="btn btn-back" href={base + '/championship/' + selection.currentId + '/'}>👑 Accueil</a>
{/snippet}

<h2>Asso : {club.name}</h2>

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
