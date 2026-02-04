<script lang="ts">
	import type { MarkedPointScale } from '$lib/types/markedPointScaleType';
	import { mpsStore } from '$lib/stores/championship/markedPointScaleStore.svelte';
	import { onMount } from 'svelte';

	// Le barème passé en propriété
	let { scaleId = $bindable(), isIndividual = false } = $props();
	let scale: MarkedPointScale = $state({ id: '', name: '', isIndividual: false, points: [] });

	let qtyToAdd = $state(1); // Quantité de rangs à ajouter d'un coup
	let step = $state(1);

	function addRanks() {
		let newPoints = [...scale.points];
		for (let i = 0; i < qtyToAdd; i++) {
			const lastScore = newPoints[newPoints.length - 1] || 0;
			// Décrémentation de 1 point, minimum 0
			const nextScore = Math.max(0, lastScore - step);
			newPoints.push(nextScore);
		}
		scale.points = newPoints;
	}

	function removeLastRank() {
		if (scale.points.length > 0) {
			scale.points = scale.points.slice(0, -1);
		}
	}

	onMount(() => {
		let scaleTemp = mpsStore.list.find((scale) => scale.id === scaleId);
		console.log(scaleTemp);
		if (scaleTemp) scale = scaleTemp;
		else {
			scale = mpsStore.new(isIndividual);
			scaleId = scale.id;
		}
	});
</script>

<div class="scale-container">
	<div class="scale-header">
		<span class="badge">{scale.isIndividual ? 'Individuel' : 'Collectif'}</span>
		<h3>{scale.name || 'Nouveau barème'}</h3>
	</div>

	<div class="ranks-grid">
		{#each scale.points as point, i}
			<div class="rank-item">
				<label for="rank-{i}">{i + 1}<sup>e</sup></label>
				<input id="rank-{i}" type="number" min="0" bind:value={scale.points[i]} />
			</div>
		{/each}
	</div>

	<div class="actions-bar">
		<div class="add-group">
			<input type="number" min="1" max="50" bind:value={qtyToAdd} class="input-qty" />
			<button class="btn-add" onclick={addRanks}>
				Ajouter {qtyToAdd > 1 ? qtyToAdd + ' rangs' : 'un rang'}
			</button>
			<input type="number" min="1" max="50" bind:value={step} class="input-qty" />
		</div>

		{#if scale.points.length > 0}
			<button class="btn-remove" onclick={removeLastRank} title="Supprimer la dernière place">
				Supprimer la place {scale.points.length}
			</button>
		{/if}
	</div>
</div>

<style>
	.scale-container {
		border: 1px solid #ddd;
		border-radius: 8px;
		padding: 1rem;
		background: var(--bg-card);
	}

	.scale-header {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-bottom: 1rem;
		border-bottom: 2px solid #eee;
		padding-bottom: 0.5rem;
	}

	.badge {
		background: var(--bg-card);
		color: #4338ca;
		padding: 2px 8px;
		border-radius: 12px;
		font-size: 0.8rem;
		font-weight: bold;
	}

	.ranks-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
		gap: 10px;
		max-height: 300px;
		overflow-y: auto;
		padding: 5px;
	}

	.rank-item {
		display: flex;
		flex-direction: column;
		background: #f9fafb;
		padding: 8px;
		border-radius: 4px;
		border: 1px solid #efefef;
	}

	.rank-item label {
		font-size: 0.75rem;
		color: #666;
		margin-bottom: 4px;
	}

	.actions-bar {
		margin-top: 1.5rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: 10px;
	}

	.add-group {
		display: flex;
		gap: 5px;
	}

	.input-qty {
		width: 60px;
	}

	.btn-add {
		background: #22c55e;
		color: white;
		border: none;
		padding: 6px 12px;
		border-radius: 4px;
		cursor: pointer;
	}
	.btn-remove {
		background: #ef4444;
		color: white;
		border: none;
		padding: 6px 12px;
		border-radius: 4px;
		cursor: pointer;
	}
</style>
