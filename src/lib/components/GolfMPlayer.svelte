<script lang="ts">
	import { slide } from 'svelte/transition';
	import { playersStore, playersWithTeams } from '$lib/stores/playersStore';
	import { teamsStore } from '$lib/stores/teamsStore';
	import { sessionSettings } from '$lib/stores/gameSessionStore';
	import { smartSort, shuffle } from '$lib/utils/sharedFunction';

	let isTeamGame: boolean = $sessionSettings.teamGame;
	let isSortTeamAsc: boolean = true;
	let isSortPlayerAsc: boolean = true;
	let isSettingTeams: boolean = false;
	let isEditingTeams: boolean = false;
	let isModifyingCompo: boolean = false;
	let listPlayersWithTeams = [];

	$: players = $playersStore;
	$: teams = $teamsStore;
	$: listPlayersWithTeams = smartSort($playersWithTeams, 'teamName', isSortTeamAsc);

	export let holeCount: number;

	function addPlayer() {
		playersStore.add('Joueur #' + (players.length + 1), '', '', holeCount);
	}

	function createTeam() {
		const nbPlayerPerTeam = $sessionSettings.playersPerTeam;
		const nbTeams = Math.floor(players.length / nbPlayerPerTeam) + 1;
		const playersSorted = shuffle(players);

		let membersId: string[] = [];

		teamsStore.reset();

		// Répartition des joueurs dans les équipes
		for (let i = 0; i < nbTeams; i++) {
			const teamName = 'Team #' + (i + 1);
			const teamId = crypto.randomUUID();
			membersId = [];

			for (let j = 0; j < nbPlayerPerTeam; j++) {
				if (playersSorted.length != 0) {
					membersId.push(playersSorted[0].id);
					playersSorted.shift();
				}
			}
			teamsStore.add(teamId, teamName, membersId);

			// Mise à jour des joueurs
			membersId.forEach((playerId) => {
				players.find((p) => p.id === playerId)!.teamId = teamId;
			});
			playersStore.set(players);
		}
	}

	function settingTeams() {
		isSettingTeams = !isSettingTeams;
	}

	function editTeams() {
		isEditingTeams = !isEditingTeams;
	}

	function modifyCompo() {
		isModifyingCompo = !isModifyingCompo;
		alert('b');
	}

	function sortPlayersByTeam() {
		isSortTeamAsc = !isSortTeamAsc;
	}

	function sortPlayersByPlayer() {
		$playersStore = smartSort(players, 'name', isSortPlayerAsc);
		isSortPlayerAsc = !isSortPlayerAsc;
	}
</script>

<div class="step-content" in:slide>
	<button on:click={addPlayer} class="btn btn-primary">Ajouter un Joueur</button>
	{#if isTeamGame}<button on:click={settingTeams} class="btn btn-primary">☰ Param équipes</button
		>{/if}
	{#if isSettingTeams}
		<button on:click={createTeam} class="btn btn-secondary">Définir les équipes</button>
		<button on:click={editTeams} class="btn btn-secondary">Editer les équipes</button>
		<button on:click={modifyCompo} class="btn btn-secondary">Modifier les équipes</button>
	{/if}

	<div class="card-list">
		<!-- Liste des équipes -->
		{#if isEditingTeams}
			<table>
				<thead>
					<tr class="par-row">
						<th class="sticky-col">Equipes</th>
						<th class="sticky-col">Action</th>
					</tr>
				</thead>
				<tbody>
					{#each $teamsStore as team}
						<tr>
							<td>
								<input
									type="text"
									bind:value={team.name}
									class="player-name-input"
									title="Cliquez pour renommer"
								/>
							</td>
							<td>
								<button
									class="btn-delete"
									on:click={() => teamsStore.remove(team.id)}
									title="Supprimer l'équipe"
								>
									&minus;
								</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		{/if}

		<!-- Liste des joueurs -->
		<table>
			<thead>
				<tr class="par-row">
					{#if isTeamGame}
						<th class="sticky-col">
							<button class="invisible-button" on:click={() => sortPlayersByTeam()}>Equipes</button>
						</th>
					{/if}
					<th class="sticky-col">
						<button class="invisible-button" on:click={() => sortPlayersByPlayer()}>Joueurs</button>
					</th>
					<th class="action-header">Action</th>
				</tr>
			</thead>
			<tbody>
				{#each listPlayersWithTeams as player, i}
					<tr>
						{#if isTeamGame}
							<td class="sticky-col">
								{player.teamName}
							</td>
						{/if}
						<!--							
						<td>
								<select id="team{player.id}" bind:value={player.team}>
									{#each $teamsStore as team}
										<option value={team.name}>{team.name}</option>
									{/each}
								</select>
							</td>
-->
						<td>
							<input
								type="text"
								bind:value={player.name}
								class="player-name-input"
								title="Cliquez pour renommer"
							/>
						</td>
						<td>
							<button
								class="btn-delete"
								on:click={() => playersStore.remove(player.id)}
								title="Supprimer le joueur"
							>
								&minus;
							</button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

<style>
	.step-content {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.btn {
		width: 100%;
		-webkit-tap-highlight-color: transparent;
		user-select: none;
		font-weight: bold;
		font-size: 1.2rem;
	}

	.invisible-button {
		background: none;
		border: none;
		padding: 0;
		font: inherit;
		cursor: pointer;
		color: inherit;
	}
</style>
