<script lang="ts">
	import type { Player } from '$lib/types/playerType';
	import type { Team } from '$lib/types/teamType';
	import { playersChampionshipStore } from '$lib/stores/championship/playersChampionshipStore.svelte';
	import { teamsChampionshipStore } from '$lib/stores/championship/teamsChampionshipStore.svelte';

	let { currentClub = $bindable(''), csId } = $props<{
		currentClub: string;
		csId: string;
	}>();

	let players: Player[] = $derived(
		playersChampionshipStore.list.filter((player) => player.clubId === '')
	);

	let teams: Team[] = $derived(teamsChampionshipStore.list.filter((team) => team.clubId === ''));
</script>

<button onclick={() => (currentClub = '')} class="subnav"> Retour à la liste des clubs </button>

{#if players.length > 0}
	<h3>Liste des joueurs sans club</h3>
	{#each players as player}
		<div>
			{player.name}
		</div>
	{/each}
{:else}
	<p>Il n'y a pas de joueurs non affiliés</p>
{/if}

{#if teams.length > 0}
	<h3>Liste des équipes sans club</h3>
	{#each teams as team}
		<div>
			{team.name}
		</div>
	{/each}
{:else}
	<p>Il n'y a pas d'équipes non affiliées</p>
{/if}
