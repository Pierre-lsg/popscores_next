<script lang="ts">
	import type { Club } from '$lib/types/clubType';
	import type { Championship } from '$lib/types/championshipType';
	import type { Team } from '$lib/types/teamType';
	import type { Player } from '$lib/types/playerType';

	import { clubsStore } from '$lib/stores/championship/clubsStore.svelte';
	import { teamsChampionshipStore } from '$lib/stores/championship/teamsChampionshipStore.svelte';

	import PlayersManagement from './PlayersManagement.svelte';
	import TeamsManagement from './TeamsManagement.svelte';
	import { navContext } from '$lib/utils/nav.svelte';
	import { onMount } from 'svelte';
	import { base } from '$app/paths';
	import { selection } from '$lib/stores/selection';
	import { playersChampionshipStore } from '$lib/stores/championship/playersChampionshipStore.svelte';

	let { currentClub = $bindable(''), championship } = $props<{
		currentClub: string;
		championship: Championship;
	}>();

	let club: Club = clubsStore.list.filter((c) => c.id === currentClub)[0];
	let teams: Team[] = $state(teamsChampionshipStore.list.filter((t) => t.clubId === club.id));
	let players: Player[] = $state(playersChampionshipStore.list.filter((p) => p.clubId === club.id));

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

	const unallocTeams = () => {
		//
		teams.forEach((t) => (t.playersId = []));
		players.forEach((p) => (p.teamId = ''));
	};

	onMount(() => {
		navContext.headerAction = returnButton;
		return () => (navContext.headerAction = prevReturnButton);
	});
</script>

{#snippet returnButton()}
	<span class="btn btn-back" role="none" onclick={() => (currentClub = '')}>👥 Accueil</span>
{/snippet}

{#snippet prevReturnButton()}
	<a class="btn btn-back" href={base + '/championship/' + selection.currentId + '/'}>👑 Accueil</a>
{/snippet}

<h2>Asso : {club.name}</h2>

<button class="btn btn-primary" onclick={() => unallocTeams()}>Désallouer les équipes</button>

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
