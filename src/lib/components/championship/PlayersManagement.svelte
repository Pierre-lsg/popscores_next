<script lang="ts">
	import { clubsStore } from '$lib/stores/championship/clubsStore.svelte';
	import { playersChampionshipStore } from '$lib/stores/championship/playersChampionshipStore.svelte';
	import photo from '$lib/assets/photo.png';

	import Param from '$lib/ui/Param.svelte';

	import type { Club } from '$lib/types/clubType';
	import type { Player } from '$lib/types/playerType';

	let { currentClub = $bindable('') } = $props<{
		currentClub: string;
	}>();

	let club: Club = clubsStore.list.filter((c) => c.id === currentClub)[0];

	let players = $derived<Player[]>(
		playersChampionshipStore.list.filter((p) => p.clubId === currentClub)
	);
	let numPlayers: number = $derived(players.length);

	let creatingNewPlayer: boolean = $state(false);
	let editingPlayer: boolean[] = $state([]);
	let playerName: string = $state('');
	let playerSurname: string = $state('');
	let playerNickname: string = $state('');

	// Function to add a new player
	const addNewPlayer = () => {
		playersChampionshipStore.add(playerName, playerSurname, playerNickname, club.id);
		creatingNewPlayer = false;
	};

	// Function to remove a player
	const removePlayer = (playerId: string) => {
		if (confirm('Voulez-vous vraiment supprimer ce joueur ?')) {
			playersChampionshipStore.remove(playerId);
		}
		// Todo : fix this. It should the derived runes which recalculate this
		players = playersChampionshipStore.list.filter((p) => p.clubId === currentClub);
	};

	// Function to toggle editing of a player
	const editPlayer = (index: number) => {
		for (let i = 0; i < numPlayers; i++) {
			if (i !== index) editingPlayer[i] = false;
		}
		editingPlayer[index] = !editingPlayer[index];
	};
</script>

<div class="players-list">
	{#each players as player, i}
		<div class="player-item">
			<div
				style="background-image: url({photo}); background-size: cover; opacity: 0.15;"
				class="player-card"
			>
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
			<Param
				label="Nom du joueur"
				type="text"
				bind:value={player.name}
				focus={true}
				placeholder="Nom du joueur"
			/>
			<Param
				label="Nom de famille"
				type="text"
				bind:value={player.surname}
				placeholder="Nom du famille"
			/>
			<Param label="Surnom" type="text" bind:value={player.nickname} placeholder="Surnom" />
		</div>
	{/if}
{/each}

{#if players.length === 0}
	<p>Aucun joueur enregistré pour le moment. 🏆</p>
{/if}

<button onclick={() => (creatingNewPlayer = true)}>Ajouter un nouveau joueur</button>

{#if creatingNewPlayer}
	<div class="player-form">
		<h3>Nouveau joueur</h3>
		<Param
			label="Nom du joueur"
			type="text"
			bind:value={playerName}
			focus={true}
			placeholder="Nom du joueur"
		/>
		<Param
			label="Nom de famille"
			type="text"
			bind:value={playerSurname}
			placeholder="Nom de famille"
		/>
		<Param label="Surnom" type="text" bind:value={playerNickname} placeholder="Surnom" />
		<button onclick={addNewPlayer}>Créer</button>
		<button onclick={() => (creatingNewPlayer = false)}>Annuler</button>
	</div>
{/if}

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
		background: rgba(240, 240, 240, 0.99);
		color: rgb(0, 0, 0);
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
