<script lang="ts">
	import { slide } from 'svelte/transition';
	import { playersStore } from '$lib/stores/playersStore';
	import type { Player } from '$lib/types/types';

	$: players = $playersStore;

	export let holeCount: number;

	function addPlayer() {
		playersStore.add('Joueur #' + (players.length + 1), holeCount);
	}

	function confirmDeletePlayer(player: Player) {
		if (confirm(`Supprimer ${player.name} ?`)) {
			playersStore.remove(player.id);
		}
	}
</script>

<div class="step-content" in:slide>
	<h2>👥 Qui joue ?</h2>
	<button on:click={addPlayer} class="btn btn-primary">Ajouter un Joueur</button>

	<div class="card-list">
		<table>
			<thead>
				<tr class="par-row">
					<th class="sticky-col"><strong>Joueurs</strong></th>
					<th class="action-header">Action</th>
				</tr>
			</thead>
			<tbody>
				{#each $playersStore as player, i}
					<tr>
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
	}
</style>
