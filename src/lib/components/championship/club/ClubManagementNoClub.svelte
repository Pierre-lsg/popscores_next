<script lang="ts">
	import type { Player } from '$lib/types/playerType';
	import type { Team } from '$lib/types/teamType';
	import type { Club } from '$lib/types/clubType';
	import { playersChampionshipStore } from '$lib/stores/championship/playersChampionshipStore.svelte';
	import { teamsChampionshipStore } from '$lib/stores/championship/teamsChampionshipStore.svelte';
	import { clubsStore } from '$lib/stores/championship/clubsStore.svelte';
	import Selector from '$lib/ui/Selector.svelte';
	import type { Championship } from '$lib/types/championshipType';

	let { currentClub = $bindable(''), championship } = $props<{
		currentClub: string;
		championship: Championship;
	}>();

	let players: Player[] = $derived(
		playersChampionshipStore.list.filter((player) => player.clubId === '')
	);
	let teams: Team[] = $derived(teamsChampionshipStore.list.filter((team) => team.clubId === ''));

	let aClubId: string = $state('');
	let isAttachingPlayer: boolean = $state(false);
	let checkedPlayers = $state([]);

	const moveToSelectClub = () => {
		let club: Club | undefined = clubsStore.find(aClubId);

		if (club) {
			checkedPlayers.forEach((player: Player) => {
				// Ajout de la référence joueur au club
				if (!club.playersId.includes(player.id)) {
					club.playersId.push(player.id);
				}
				// Ajout de la référence du club au joueur
				player.clubId = club.id;
			});
		}
		isAttachingPlayer = false;
	};
</script>

<button onclick={() => (currentClub = '')} class="subnav"> Retour à la liste des clubs </button>

{#if players.length > 0}
	<h3>Liste des joueurs sans club</h3>
	<button onclick={() => (isAttachingPlayer = true)}>Rattacher à un club</button>
	{#if isAttachingPlayer}
		<div>
			<Selector
				id="clubSelect"
				bind:value={aClubId}
				label="Liste des clubs"
				options={clubsStore.list.map((club) => club.id)}
				optionsLabel={clubsStore.list.map((club) => club.name)}
			/>
		</div>
	{/if}

	{#each players as player, i}
		<div class="player-list">
			{#if isAttachingPlayer}
				<input type="checkbox" value={player} id={player.id} bind:group={checkedPlayers} />
			{/if}
			<label class="player-item" for={player.id}>
				{player.name}
			</label>
		</div>
	{/each}

	{#if isAttachingPlayer}
		<div class="action">
			<button onclick={() => moveToSelectClub()}>Valider</button>
			<button onclick={() => (isAttachingPlayer = false)}>Annuler</button>
		</div>
	{/if}
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

<style>
	.player-item {
		background: var(--bg-card);
		border: 1px solid var(--border-color);
		border-radius: 8px;
		padding: 0.5rem;
		width: 100%;
	}

	.player-list {
		display: flex;
	}
</style>
