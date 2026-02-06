<script lang="ts">
	import Param from '$lib/ui/Param.svelte';

	import type { Player } from '$lib/types/playerType';
	import type { Team } from '$lib/types/teamType';

	let {
		currentClub = $bindable(''),
		team = $bindable(null),
		clubPlayers = $bindable([])
	} = $props<{
		currentClub: string;
		team: Team;
		clubPlayers: Player[];
	}>();

	console.log('tt', currentClub, team, clubPlayers);

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

	// Function to handle selecting a player and adding it to the team
	const selectPlayer = () => {
		let player = clubPlayers.find((p: Player) => p.id === playerId);
		if (player) player.teamId = team.id;
		team.playersId.push(playerId);
		isSelectVisible = false;
	};
</script>

<div class="team-form">
	<h3>Modifier l'équipe 👥</h3>
	<Param
		label="Nom de l'équipe"
		type="text"
		value={team.name}
		focus={true}
		placeholder="Nom de l'équipe"
	/>
	<!-- Existing player selection code -->
	{#if team.playersId.length < 2}
		<button onclick={addPlayer}>Ajouter un joueur</button>
		{#if isSelectVisible}
			<select bind:value={playerId} onchange={() => selectPlayer()}>
				<option value="">-- choisir un joueur --</option>
				{#each playersAvailable as player, i}
					<option value={player.id}>{player.name}</option>
				{/each}
			</select>
		{/if}
	{/if}

	{#each team.playersId as playerId (playerId)}
		<div class="team-players">
			<div>{clubPlayers.find((p: Player) => p.id === playerId).name}</div>
			<button onclick={() => removePlayer(playerId)}>X</button>
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

	select {
		padding: 0.5rem;
		width: 60%;
	}
</style>
