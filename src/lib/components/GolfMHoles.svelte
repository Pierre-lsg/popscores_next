<script lang="ts">
	import Stepper from '$lib/ui/Stepper.svelte';

	import { slide } from 'svelte/transition';
	import { holesStore } from '$lib/stores/holesStore';
	import { playersStore } from '$lib/stores/playersStore';

	let rule = 'Individuel';
	const ruleOptions = ['Individuel', 'Scramble', 'Greensome', 'Chapman', 'Foursome', 'Bonus'];

	function addHole() {
		holesStore.add();
		// à améliorer
		playersStore.syncAddHole(4);
	}

	function confirmDeleteHole(index: number) {
		if (confirm(`Supprimer le trou n°${index + 1} ?`)) {
			// On appelle les deux stores pour rester synchronisé
			holesStore.remove(index);
			playersStore.syncRemoveHole(index);
		}
	}
</script>

<div class="step-content" in:slide>
	<button on:click={addHole} class="btn btn-primary">Ajouter un Trou</button>
	<table>
		<thead>
			<tr class="par-row">
				<th class="sticky-col"><strong>Par</strong></th>
				<th class="sticky-col"><strong>Règle</strong></th>
				<th class="action-header">Action</th>
			</tr>
		</thead>
		<tbody>
			{#each $holesStore as hole, i}
				<tr class="scroll-area">
					<td>
						<Stepper
							label=" {i + 1} "
							bind:value={hole.par}
							min={0}
							disabled={hole.rule === 'Bonus'}
						/>
					</td>
					<td>
						<select id="rule{hole.id}" bind:value={hole.rule}>
							{#each ruleOptions as option}
								<option value={option}>{option}</option>
							{/each}
						</select>
					</td>
					<td>
						<button class="btn-delete" on:click={() => confirmDeleteHole(i)}> &times; </button>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
	.scroll-area {
		max-height: 60vh;
		overflow-y: auto;
		padding-right: 5px;
	}

	.btn {
		width: 100%;
		-webkit-tap-highlight-color: transparent;
		user-select: none;
		font-weight: bold;
		font-size: 1.2rem;
	}

	select {
		padding: 0.8rem;
		border: 1px solid #ccc;
		border-radius: 4px;
		font-size: 1rem;
	}
</style>
