<script lang="ts">
	import Param from '$lib/ui/Param.svelte';
	import Selector from '$lib/ui/Selector.svelte';

	import type { Player } from '$lib/types/playerType';
	import type { Team } from '$lib/types/teamType';

	let {
		team = $bindable(null),
		players = $bindable([]),
		playersPerTeam = 0
	} = $props<{
		team: Team;
		players: Player[];
		playersPerTeam: number;
	}>();

	let playersAvailable = $derived<Player[]>(players.filter((p: Player) => p.teamId === ''));
	let playerId: string = $state('');

	// Initialize a variable to track whether the selection dropdown should be displayed
	let isSelectVisible = $state(false);

	// Function to handle adding a player when the button is clicked
	const addPlayer = () => {
		isSelectVisible = true;
	};

	const removePlayer = (playerId: string) => {
		let player = players.find((p: Player) => p.id === playerId);
		if (player) player.teamId = '';
		team.playersId = team.playersId.filter((p: string) => p !== playerId);
	};

	// Function to handle selecting a player and adding it to the team
	const selectPlayer = () => {
		let player = players.find((p: Player) => p.id === playerId);
		if (player) player.teamId = team.id;
		team.playersId.push(playerId);
		isSelectVisible = false;
	};
</script>

<div class="item-form">
	<h4>Modifier l'équipe "{team.name}"</h4>
	<Param
		label="Nom de l'équipe"
		type="text"
		bind:value={team.name}
		focus={true}
		placeholder="Nom de l'équipe"
	/>
	<!-- Existing player selection code -->
	{#if playersAvailable.length > 0 && team.playersId.length < playersPerTeam}
		<button onclick={addPlayer}>Ajouter un joueur</button>
		{#if isSelectVisible}
			<Selector
				bind:value={playerId}
				options={playersAvailable.map((p: Player) => p.id)}
				optionsLabel={playersAvailable.map((p: Player) => p.name)}
				unselectedOption="-- choisir un joueur"
				onchange={() => selectPlayer()}
			/>
		{/if}
	{/if}

	{#each team.playersId as playerId (playerId)}
		<div class="team-players">
			<div>{players.find((p: Player) => p.id === playerId).name}</div>
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
</style>
