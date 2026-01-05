<script lang="ts">
	import type { Player } from '$lib/types/playerInterface';
	import { targetsStore } from '$lib/stores/targetsStore.svelte';
	import { playersStore } from '$lib/stores/playersStore.svelte';
	import { getRelativeScore, getTotalStrokes } from '$lib/utils/utils';
	import { gameStatus } from '$lib/stores/gameStatusStore.svelte';

	let {
		players = playersStore.list
	}: {
		players?: Player[];
	} = $props();

	let targets = $derived(targetsStore.list);
	let targetCount = $derived(targets.length);
	let totalPar = $derived(targets.reduce((acc, h) => acc + (h.par || 0), 0));

	let isSetup = $derived(gameStatus.status === 'setup');
	let isFinished = $derived(gameStatus.status === 'finished');
	let isLocked = $derived(isFinished || gameStatus.status === 'in_progress');
	let isHidden = $derived(isLocked ? 'hide' : '');

	function confirmDeleteTarget(index: number) {
		if (confirm(`Supprimer le trou n°${index + 1} ?`)) {
			// On appelle les deux stores pour rester synchronisé
			targetsStore.remove(index);
			playersStore.syncRemoveTarget(index);
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
				{#each targets as target, i}
					<td>
						{#if !isLocked}
							<input
								type="number"
								bind:value={target.par}
								disabled={isLocked}
								oninput={() => targetsStore.updatePar(i, target.par || 0)}
								class="par-input"
								min="1"
							/>
						{:else}
							<strong>{target.par}</strong>
						{/if}
					</td>
				{/each}
				<td class="total-header">{totalPar}</td>
				<td></td>
			</tr>
			<tr>
				<th class="sticky-col">Joueur</th>
				{#each Array(targetCount) as _, i}
					<th class="target-header">
						T{i + 1}
						<button class="btn-mini-delete {isHidden}" onclick={() => confirmDeleteTarget(i)}>
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
						{@const relativeScore = getRelativeScore(player.scores, targets)}
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
