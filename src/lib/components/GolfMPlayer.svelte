<script lang="ts">
	import { slide } from 'svelte/transition';
	import { playersStore } from '$lib/stores/playersStore.svelte';
	import { teamsStore } from '$lib/stores/teamsStore.svelte';
	import { sessionSettingsStore } from '$lib/stores/gameSessionStore.svelte';
	import { smartSort, shuffle } from '$lib/utils/sharedFunction';

	const s = sessionSettingsStore.settings;

	let isTeamGame: boolean = s.teamGame;
	let isSortTeamAsc: boolean = true;
	let isSortPlayerAsc: boolean = true;
	let isSettingTeams: boolean = $state(false);
	let isEditingTeams: boolean = $state(false);
	let isModifyingCompo: boolean = false;

	let { targetCount }: { targetCount: number } = $props();

	// $inspect(isEditingTeams, isTeamGame, playersStore.list);

	function addPlayer() {
		playersStore.add('Joueur #' + (playersStore.list.length + 1), targetCount);
	}

	function createTeam() {
		const nbPlayerPerTeam = s.playersPerTeam;
		const nbTeams = Math.floor(playersStore.list.length / nbPlayerPerTeam) + 1;
		const playersSorted = shuffle(playersStore.list);

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
				playersStore.list.find((p) => p.id === playerId)!.teamId = teamId;
			});
			// playersStore.list = players;
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
		playersStore.list = smartSort(playersStore.list, 'name', isSortPlayerAsc);
		isSortPlayerAsc = !isSortPlayerAsc;
	}
</script>

<div class="step-content" in:slide>
	<button onclick={addPlayer} class="btn btn-primary">Ajouter un Joueur</button>
	{#if isTeamGame}<button onclick={settingTeams} class="btn btn-primary">☰ Param équipes</button
		>{/if}
	{#if isSettingTeams}
		<button onclick={createTeam} class="btn btn-secondary">Définir les équipes</button>
		<button onclick={editTeams} class="btn btn-secondary">Editer les équipes</button>
		<button onclick={modifyCompo} class="btn btn-secondary">Modifier les équipes</button>
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
					{#each teamsStore.list as team}
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
									onclick={() => teamsStore.remove(team.id)}
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
							<button class="invisible-button" onclick={() => sortPlayersByTeam()}>Equipes</button>
						</th>
					{/if}
					<th class="sticky-col">
						<button class="invisible-button" onclick={() => sortPlayersByPlayer()}>Joueurs</button>
					</th>
					<th class="action-header">Action</th>
				</tr>
			</thead>
			<tbody>
				{#each playersStore.list as player}
					<tr>
						{#if isTeamGame}
							<td class="sticky-col">
								{playersStore.getTeamName(player)}
							</td>
						{/if}
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
								onclick={() => playersStore.remove(player.id)}
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
