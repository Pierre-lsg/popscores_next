<script lang="ts">
	import type { Player } from '$lib/types/playerIntfc';
	import type { Hole } from '$lib/types/holesIntfc';
	import { holesStore } from '$lib/stores/holesStore.svelte';
	import { playersStore } from '$lib/stores/playersStore.svelte';
	import { getRelativeScore, getTotalStrokes } from '$lib/utils/utils';
	import { gameStatus } from '$lib/stores/gameStatusStore.svelte';

	let {
		players = playersStore.list
	}: {
		players?: Player[];
	} = $props();

	let holes = $derived(holesStore.list);
	let holeCount = $derived(holes.length);
	let totalPar = $derived(holes.reduce((acc, h) => acc + (h.par || 0), 0));

	let isSetup = $derived(gameStatus.status === 'setup');
	let isFinished = $derived(gameStatus.status === 'finished');
	let isLocked = $derived(isFinished || gameStatus.status === 'in_progress');
	let isHidden = $derived(isLocked ? 'hide' : '');

	function confirmDeleteHole(index: number) {
		if (confirm(`Supprimer le trou n°${index + 1} ?`)) {
			// On appelle les deux stores pour rester synchronisé
			holesStore.remove(index);
			playersStore.syncRemoveHole(index);
		}
	}

	function confirmDeletePlayer(player: Player) {
		if (confirm(`Supprimer ${player.name} ?`)) {
			playersStore.remove(player.id);
		}
	}
</script>

<div class="table-container">
	<table>
		<thead>
			<tr class="par-row">
				<td class="sticky-col"><strong>PAR</strong></td>
				{#each holes as hole, i}
					<td>
						{#if !isLocked}
							<input
								type="number"
								bind:value={hole.par}
								disabled={isLocked}
								oninput={() => holesStore.updatePar(i, hole.par || 0)}
								class="par-input"
								min="1"
							/>
						{:else}
							<strong>{hole.par}</strong>
						{/if}
					</td>
				{/each}
				<td class="total-header">{totalPar}</td>
				<td></td>
			</tr>
			<tr>
				<th class="sticky-col">Joueur</th>
				{#each Array(holeCount) as _, i}
					<th class="hole-header">
						T{i + 1}
						<button class="btn-mini-delete {isHidden}" onclick={() => confirmDeleteHole(i)}>
							&times;
						</button>
					</th>
				{/each}
				<th class="total-header">+/-</th>
				<th class="action-header {isHidden}">Action</th>
			</tr>
		</thead>
		<tbody>
			{#each players as player (player.id)}
				<tr>
					<td class="sticky-col">
						{#if !isLocked}
							<input
								type="text"
								bind:value={player.name}
								class="player-name-input"
								title="Cliquez pour renommer"
							/>
						{:else}
							<strong>{player.name}</strong>
						{/if}
					</td>
					{#each player.scores as _, i}
						<td>
							<input
								type="number"
								inputmode="numeric"
								pattern="[0-9]*"
								bind:value={player.scores[i]}
								disabled={isSetup || isFinished}
								placeholder={isSetup ? '-' : '0'}
								oninput={() => (playersStore.list = players)}
								min="0"
								class="score-input"
							/>
						</td>
					{/each}

					{#if true}
						{@const relativeScore = getRelativeScore(player.scores, holes)}
						<td
							class="total-cell {relativeScore < 0
								? 'under-par'
								: relativeScore > 0
									? 'over-par'
									: 'even-par'}"
						>
							{relativeScore > 0 ? '+' : ''}{relativeScore}
						</td>
					{/if}

					<td>
						<button
							class="btn-delete {isHidden}"
							onclick={() => confirmDeletePlayer(player)}
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
