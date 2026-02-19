<script lang="ts">
	import { clubsStore } from '$lib/stores/championship/clubsStore.svelte';
	import { playersChampionshipStore } from '$lib/stores/championship/playersChampionshipStore.svelte';
	import photo from '$lib/assets/photo.png';

	import Param from '$lib/ui/Param.svelte';

	import type { Club } from '$lib/types/clubType';
	import type { Player } from '$lib/types/playerType';
	import Selector from '$lib/ui/Selector.svelte';

	const pcs = playersChampionshipStore;

	let { currentClub = $bindable('') } = $props<{
		currentClub: string;
	}>();

	let club: Club = clubsStore.list.filter((c) => c.id === currentClub)[0];
	let newClubId: string = $state(club.id);

	let players = $derived<Player[]>(pcs.list.filter((p) => p.clubId === currentClub));
	let numPlayers: number = $derived(players.length);

	let isCreatingNewPlayer: boolean = $state(false);
	let isEditingPlayer: boolean = $state(false);
	let editingPlayer: boolean[] = $state([]);
	let playerName: string = $state('');
	let playerSurname: string = $state('');
	let playerNickname: string = $state('');

	// Function to add a new player
	const addNewPlayer = () => {
		const newPlayer: Player = pcs.add(playerName, playerSurname, playerNickname, club.id);
		if (!club.playersId.includes(newPlayer.id)) {
			club.playersId.push(newPlayer.id);
		}

		playerName = playerSurname = playerNickname = '';
		isCreatingNewPlayer = false;
	};

	// Function to remove a player
	const removePlayer = (playerId: string) => {
		if (confirm('Voulez-vous vraiment supprimer ce joueur ?')) {
			pcs.remove(playerId);
			editingPlayer.fill(false);
		}
		// Todo : fix this. It should the derived runes which recalculate this
		players = pcs.list.filter((p) => p.clubId === currentClub);
		editingPlayer.fill(false);
	};

	// Function to toggle editing of a player
	const editPlayer = (player: Player, index: number) => {
		// Change club if needed
		if (newClubId !== club.id) {
			player.clubId = newClubId;
			// Remove player.id from club.playersId
			const indexToRemove = club.playersId.indexOf(player.id);
			if (indexToRemove !== -1) {
				club.playersId.splice(indexToRemove, 1);
			}
		}

		// Mask edit options
		for (let i = 0; i < numPlayers; i++) {
			if (i !== index) editingPlayer[i] = false;
		}
		editingPlayer[index] = !editingPlayer[index];
		isEditingPlayer = editingPlayer.some((value) => value === true);
	};
</script>

{#if !isEditingPlayer && !isCreatingNewPlayer}
	<div class="players-list">
		{#each players as player, i}
			<div role="none" class="player-item" onclick={() => editPlayer(player, i)}>
				<div style="background-image: url({photo});" class="player-card">
					<div class="details">
						<div>{player.name}</div>
						<div>{player.surname}</div>
						<div>{player.nickname}</div>
					</div>
				</div>
			</div>
		{/each}
	</div>

	{#if players.length === 0}
		<p>Aucun joueur enregistré pour le moment. 🏆</p>
	{/if}

	{#if !editingPlayer.some(Boolean) && !isCreatingNewPlayer}
		<button onclick={() => (isCreatingNewPlayer = true)}>Ajouter un nouveau joueur</button>
	{/if}
{:else}
	{#each players as player, i}
		{#if editingPlayer[i]}
			<div class="player-form">
				<h3 style="margin-top: 0">Modifier le joueur 👤</h3>
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
				<Selector
					id="clubSelect"
					bind:value={newClubId}
					label="Liste des clubs"
					options={clubsStore.list.map((club) => club.id)}
					optionsLabel={clubsStore.list.map((club) => club.name)}
				/>
				<div class="action">
					<button onclick={() => editPlayer(player, i)}> Valider </button>
					<button onclick={() => removePlayer(player.id)}> 🗑️ Supprimer</button>
				</div>
			</div>
		{/if}
	{/each}
{/if}

{#if isCreatingNewPlayer}
	<div class="player-form">
		<h3 style="margin-top: 0">Nouveau joueur 👤</h3>
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
		<div class="action">
			<button onclick={addNewPlayer}>Créer</button>
			<button onclick={() => (isCreatingNewPlayer = false)}>Annuler</button>
		</div>
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
		justify-content: space-around;
		width: 100%;
		height: 150px;
		background-color: var(--bg-card);
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		cursor: pointer;
		margin: 0 0.5rem 0 0;
		background-size: contain;
		background-repeat: no-repeat;
	}

	.player-card:hover {
		transform: translateY(-5px);
		border-color: var(--border-color);
	}

	.player-form {
		border: 1px var(--primary) solid;
		padding: 0.5rem;
		border-radius: 0.5rem;
	}

	.details {
		font-size: large;
		align-items: center;
		padding: 0.5rem;
		gap: 8px;
		background-color: rgba(255, 255, 255, 0.8);
		color: var(--primary);
	}
</style>
