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

	let playersAvailable = $derived<Player[]>(
		clubPlayers.filter((p: Player) => !team.playersId.includes(p.id))
	);

	// Initialize a variable to track whether the selection dropdown should be displayed
	let isSelectVisible = $state(false);

	// Function to handle adding a player when the button is clicked
	function addPlayer() {
		isSelectVisible = true;
	}

	// Function to handle selecting a player and adding it to the team
	function selectPlayer(playerId: string) {
		team.playersId.push(playerId);
		isSelectVisible = false;
	}
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

	{#each team.playersId as playerId (playerId)}
		<div>{clubPlayers.find((p: Player) => p.id === playerId).name}</div>
	{/each}

	<!-- Existing player selection code -->
	{#if team.playersId.length < 2}
		<button onclick={addPlayer}>Ajouter un joueur</button>
		{#if isSelectVisible}
			<select onchange={(e) => selectPlayer((e.target as HTMLSelectElement).value)}>
				<option value="">-- choisir un joueur --</option>
				{#each playersAvailable as player, i}
					<option value={player.id}>{player.name}</option>
				{/each}
			</select>
		{/if}
	{/if}
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
