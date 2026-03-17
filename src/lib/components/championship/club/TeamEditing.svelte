<script lang="ts">
	import Param from '$lib/ui/Param.svelte';
	import Selector from '$lib/ui/Selector.svelte';
	import MultiSelector from '$lib/ui/MultiSelector.svelte';

	import type { Player } from '$lib/types/playerType';
	import type { Team } from '$lib/types/teamType';
	import { playersChampionshipStore } from '$lib/stores/championship/playersChampionshipStore.svelte';

	let {
		currentClub = $bindable(''),
		team = $bindable(null),
		clubPlayers = $bindable([])
	} = $props<{
		currentClub: string;
		team: Team;
		clubPlayers: Player[];
	}>();

	let playersAvailable = $derived<Player[]>(clubPlayers.filter((p: Player) => p.teamId === ''));
	let playerId: string = $state('');

	// Initialize a variable to track whether the selection dropdown should be displayed
	let isSelectVisible = $state(false);

	// Function to handle adding a player when the button is clicked
	const addPlayer = () => {
		isSelectVisible = true;
	};

	const removePlayer = (playerId: string) => {
		let player = clubPlayers.find((p: Player) => p.id === playerId);
		if (player) player.teamId = '';
		team.playersId = team.playersId.filter((p: string) => p !== playerId);
	};

	const confirmPlayersTeam = () => {
		team.playersId.forEach((pId: string) => {
			let player = clubPlayers.find((p: Player) => p.id === pId);
			if (player) player.teamId = team.id;
		});
	};

	// Function to handle selecting a player and adding it to the team
	const selectPlayer = () => {
		let player = clubPlayers.find((p: Player) => p.id === playerId);
		if (player) player.teamId = team.id;
		team.playersId.push(playerId);
		isSelectVisible = false;
	};

	const displayPlayer = (playerId: string) => {
		let player = clubPlayers.find((p: Player) => p.id === playerId);
		if (player) return player.name;
		else {
			console.log('joueurs externes : ', playerId);
			return (player =
				(playersChampionshipStore.list.find((p: Player) => p.id === playerId)?.name || '') +
				' (*)');
		}
	};
</script>

<div class="team-form">
	<h3 style="margin-top: 0">Modifier l'équipe 👥</h3>
	<Param
		label="Nom de l'équipe"
		type="text"
		bind:value={team.name}
		focus={true}
		placeholder="Nom de l'équipe"
	/>
	<!-- Existing player selection code -->
	{#if playersAvailable.length > 0}
		<button onclick={addPlayer}>Ajouter un joueur</button>
		{#if isSelectVisible}
			<MultiSelector
				id="managerSelect"
				bind:value={team.playersId}
				label="Sélection de joueurs"
				options={playersAvailable.map((p: Player) => p.id)}
				optionsLabel={playersAvailable.map((p: Player) => p.name)}
				onchange={() => confirmPlayersTeam()}
			/>
			<!--
			<Selector
				bind:value={playerId}
				options={playersAvailable.map((p: Player) => p.id)}
				optionsLabel={playersAvailable.map((p: Player) => p.name)}
				unselectedOption="-- choisir un joueur"
				onchange={() => selectPlayer()}
			/>
-->
		{/if}
	{/if}

	{#each team.playersId as playerId (playerId)}
		<div class="team-players">
			<div>{displayPlayer(playerId)}</div>
			<button class="btn-delete-small" onclick={() => removePlayer(playerId)}>X</button>
		</div>
	{/each}
</div>

<style>
	.team-players {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		width: 100%;
	}
</style>
