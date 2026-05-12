<script lang="ts">
	import type { MarkedPointScale } from '$lib/types/markedPointScaleType';
	import { mpsStore } from '$lib/stores/championship/markedPointScaleStore.svelte';
	import { onMount } from 'svelte';

	// Le barème passé en propriété
	let { scaleId = '', isIndividual = false } = $props();
	let scale: MarkedPointScale | undefined = $derived(mpsStore.getScaleById(scaleId));

	let qtyToAdd = $state(1); // Quantité de rangs à ajouter d'un coup
	let step = $state(1);

	onMount(() => {
		if (!scale) mpsStore.add(scaleId, '', isIndividual, []);
	});

	const addRanks = () => {
		if (scale) {
			let newPoints = [...scale.points];
			for (let i = 0; i < qtyToAdd; i++) {
				const lastScore = newPoints[newPoints.length - 1] || 0;
				// Décrémentation de 1 point, minimum 0
				const nextScore = Math.max(0, lastScore - step);
				newPoints.push(nextScore);
			}
			scale.points = newPoints;
		}
	};

	const removeLastRank = () => {
		if (scale) {
			if (scale.points.length > 0) {
				scale.points = scale.points.slice(0, -1);
			}
		}
	};
</script>

<div class="card" style="width: 100%; box-sizing: border-box; align-items: stretch; text-align: left;">
	{#if scale}
		<div class="scale-header">
			<h3>{scale.name || 'Barème'}</h3>
			<span class="badge">{scale.isIndividual ? 'Individuel' : 'Collectif'}</span>
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
				<button class="btn status-success" onclick={addRanks}> Ajouter </button>
				<input type="number" min="1" max="50" bind:value={qtyToAdd} class="input-qty" />
				{#if scale.points.length === 0}
					<input value={qtyToAdd > 1 ? 'rangs' : 'rang'} class="viewInput" disabled />
				{:else}
					<input value={qtyToAdd > 1 ? 'rangs de pas' : 'rang de pas'} class="viewInput" disabled />
					<input type="number" min="1" max="50" bind:value={step} class="input-qty" />
				{/if}
			</div>

			{#if scale.points.length > 0}
				<button class="btn status-alert" onclick={removeLastRank} title="Supprimer la dernière place">
					Supprimer ({scale.points.length})
				</button>
			{/if}
		</div>
	{:else}
		<p>Echec à la récupération de l'échelle</p>
	{/if}
</div>

<style>
	.viewInput {
		max-width: 7rem;
	}

	.scale-header {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-bottom: 1rem;
		border-bottom: 2px solid var(--border-color);
		padding-bottom: 0.5rem;
	}

	.badge {
		background: var(--bg-app);
		color: var(--primary);
		padding: 2px 8px;
		border-radius: 12px;
		font-size: 0.8rem;
		font-weight: bold;
	}

	.ranks-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
		gap: 10px;
		max-height: 300px;
		overflow-y: auto;
		padding: 5px;
	}

	.rank-item {
		display: flex;
		flex-direction: column;
		background: var(--bg-app);
		padding: 8px;
		border-radius: 6px;
		border: 1px solid var(--border-color);
	}

	.rank-item label {
		font-size: 0.75rem;
		color: var(--secondary);
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
</style>
