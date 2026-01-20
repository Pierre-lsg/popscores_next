<script lang="ts">
	import { clubsStore } from '$lib/stores/clubsStore.svelte';
	import { playersChampionshipStore } from '$lib/stores/playersChampionshipStore.svelte';
	import { teamsChampionshipStore } from '$lib/stores/teamsChampionshipStore.svelte';
	import Param from '$lib/ui/Param.svelte';

	import type { Club } from '$lib/types/clubType';
	import type { Player } from '$lib/types/playerType';
	import type { Team } from '$lib/types/teamType';

	let { currentClub = $bindable('') } = $props<{
		currentClub: string;
	}>();

	let players = $state<Player[]>(playersChampionshipStore.list);
	let teams = $state<Player[]>(playersChampionshipStore.list);
	let club: Club = clubsStore.list.filter((c) => c.id !== currentClub)[0];

	let numPlayers: number = $derived(players.length);

	let creatingNewTeam: boolean = $state(false);
	let creatingNewPlayer: boolean = $state(false);
	let editingPlayer: boolean[] = $state([]);
	let editingTeam: boolean[] = $state([]);
	let playerName: string = $state('');
	let playerSurname: string = $state('');
	let playerNickname: string = $state('');

	function addNewTeam() {
		//Créer et enregistrer une équipe pour le club
	}

	function addNewPlayer() {
		playersChampionshipStore.add(playerName, playerSurname, playerNickname, club.id);
		creatingNewPlayer = false;
	}

	function removePlayer(playerId: string) {
		if (confirm('Voulez-vous vraiment supprimer ce joueur ?')) {
			playersChampionshipStore.remove(playerId);
		}
		players = playersChampionshipStore.list;
	}

	function editPlayer(index: number) {
		for (let i = 0; i < numPlayers; i++) {
			if (i !== index) editingPlayer[i] = false;
		}
		editingPlayer[index] = !editingPlayer[index];
	}
</script>

<h2>Club : {club.name}</h2>

<p>Liste des joueurs</p>

<div class="players-list">
	{#each players as player, i}
		<div class="player-item">
			<div role="none" class="player-card">
				<div class="details">
					{player.name}
				</div>
				<div class="details">
					{player.surname}
				</div>
				<div class="details">
					{player.nickname}
				</div>
				<div class="icon">((photo))</div>
			</div>
			<div class="action">
				<button onclick={() => removePlayer(player.id)}> 🗑️ </button>
				<button onclick={() => editPlayer(i)}>✏️</button>
			</div>
		</div>
	{/each}
</div>

{#each players as player, i}
	{#if editingPlayer[i]}
		<div class="player-form">
			<h3>Modifier le joueur 👤</h3>
			<Param label="Nom du joueur" type="text" bind:value={player.name} />
			<Param label="Nom de famille" type="text" bind:value={player.surname} />
			<Param label="Surnom" type="text" bind:value={player.nickname} />
		</div>
	{/if}
{/each}

{#if players.length === 0}
	<p>Aucune compétition enregistrée pour le moment. 🏆</p>
{/if}

<button onclick={() => (creatingNewPlayer = true)}>Ajouter un nouveau joueur</button>

{#if creatingNewPlayer}
	<div class="player-form">
		<h3>Nouvelle Compétition</h3>
		<Param label="Nom du joueur" type="text" bind:value={playerName} />
		<Param label="Nom de famille" type="text" bind:value={playerSurname} />
		<Param label="Surnom" type="text" bind:value={playerNickname} />
		<button onclick={addNewPlayer}>Créer</button>
		<button onclick={() => (creatingNewPlayer = false)}>Annuler</button>
	</div>
{/if}

<p>Liste des équipes</p>

<button onclick={() => addNewTeam()}>Ajouter une nouvelle équipe</button>

<button onclick={() => (currentClub = '')}> Retour à la liste des clubs </button>

<style>
	.players-list {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		margin: 0rem;
	}

	.player-item {
		display: flex;
		flex-direction: column;
		width: 95%;
		margin-bottom: 1rem;
	}

	.player-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		background-color: var(--bg-card);
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		cursor: pointer;
		margin: 0 0.5rem 0 0;
	}

	.player-card:hover {
		transform: translateY(-5px);
		border-color: var(--primary);
	}

	.details {
		align-items: center;
		margin: 0.5rem;
		gap: 8px;
	}

	.icon {
		margin: 0.5rem;
		font-size: 24px;
		color: #2c3e50;
	}

	.action {
		display: flex;
		flex-direction: row;
		justify-content: center;
		width: 100%;
		gap: 2rem;
		margin-top: 0.5rem;
	}
</style>
