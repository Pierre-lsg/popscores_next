<script lang="ts">
	import { slide } from 'svelte/transition';
	import { playersStore } from '$lib/stores/playersStore';
	import { teamsStore } from '$lib/stores/teamsStore';
	import { sessionSettings } from '$lib/stores/gameSessionStore';

	import type { Player } from '$lib/types/types';
	import { onMount } from 'svelte';

	$: players = $playersStore;

	let isHidden: string;

	export let holeCount: number;

	function addPlayer() {
		playersStore.add('Joueur #' + (players.length + 1), holeCount);
		updateIsHidden();
	}

	function createTeam() {
		const nbPlayerPerTeam = $sessionSettings.playersPerTeam;
		const nbTeams = Math.floor(players.length / nbPlayerPerTeam) + 1;
		const playersSorted = shuffle(players);

		let membersId: string[] = [];

		teamsStore.reset();

		for (let i = 0; i < nbTeams; i++) {
			const teamName = 'Team #' + (i + 1);
			membersId = [];

			for (let j = 0; j < nbPlayerPerTeam; j++) {
				if (playersSorted.length != 0) {
					membersId.push(playersSorted[0].id);
					playersSorted.shift();
				}
			}
			teamsStore.add(teamName, membersId);
		}
	}

	function confirmDeletePlayer(player: Player) {
		if (confirm(`Supprimer ${player.name} ?`)) {
			playersStore.remove(player.id);
		}
		updateIsHidden();
	}

	function updateIsHidden() {
		if ($sessionSettings.teamGame && players.length > 3) {
			isHidden = '';
		} else {
			isHidden = 'hidden';
		}
	}

	function shuffle<T>(array: T[]): T[] {
		const newArray = [...array];

		for (let i = newArray.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[newArray[i], newArray[j]] = [newArray[j], newArray[i]];
		}

		return newArray;
	}

	onMount(() => {
		updateIsHidden();
	});
</script>

<div class="step-content" in:slide>
	<button on:click={addPlayer} class="btn btn-primary">Ajouter un Joueur</button>
	<button on:click={createTeam} class="btn btn-primary {isHidden}">Calculer les équipes</button>

	<div class="card-list">
		<table>
			<thead>
				<tr class="par-row">
					<th class="sticky-col {isHidden}">Equipe</th>
					<th class="sticky-col"><strong>Joueurs</strong></th>
					<th class="action-header">Action</th>
				</tr>
			</thead>
			<tbody>
				{#each $playersStore as player, i}
					<tr>
						<td class="sticky-col {isHidden}"> </td>
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
								on:click={() => confirmDeletePlayer(player)}
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

	.hidden {
		display: none;
	}
</style>
