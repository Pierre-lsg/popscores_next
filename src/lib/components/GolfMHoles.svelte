<script lang="ts">
	import Stepper from '$lib/ui/Stepper.svelte';
	import Param from '$lib/ui/Param.svelte';

	import { slide } from 'svelte/transition';
	import { holesStore } from '$lib/stores/holesStore.svelte';
	import { playersStore } from '$lib/stores/playersStore.svelte';
	import { gameStatus } from '$lib/stores/gameStatusStore.svelte';

	const ruleOptions = ['Individuel', 'Scramble', 'Greensome', 'Chapman', 'Foursome', 'Bonus'];
	let isAdding = false;
	let newHoleName = 'Trou';
	let newHoleRule = ruleOptions[0]; // Règle par défaut
	let openedHoleIndex: number | null = null;

	function toggleHoleDetails(index: number) {
		if (openedHoleIndex === index) openedHoleIndex = null;
		else openedHoleIndex = index;
	}

	function addHole() {
		isAdding = true;
		openedHoleIndex = null;
	}

	function confirmAdd() {
		// On ajoute le trou au store avec les paramètres saisis
		holesStore.add(newHoleRule === 'bonus' ? 0 : 4, newHoleName, newHoleRule);

		// à améliorer
		playersStore.syncAddHole(4);

		// On réinitialise pour le prochain ajout
		isAdding = false;
		newHoleName = 'Trou';
		newHoleRule = 'individuel';

		// Et l'index du trou en cours de saisie si nécessaire
		gameStatus.currentHoleIndex = 0;
	}

	function confirmDeleteHole(index: number) {
		holesStore.remove(index);
		playersStore.syncRemoveHole(index);
		gameStatus.currentHoleIndex = 0;
	}
</script>

<div class="step-content" in:slide>
	{#if !isAdding}
		<button onclick={() => addHole()} class="btn btn-primary">Ajouter un Trou ≡</button>
	{:else}
		<div class="hole-config-box">
			<Param label="Nom du Trou" type="text" bind:value={newHoleName} />

			<div class="field-container">
				Règle
				<select bind:value={newHoleRule}>
					{#each ruleOptions as option}
						<option value={option}>{option}</option>
					{/each}
				</select>
			</div>

			<div class="actions">
				<button class="btn btn-cancel" onclick={() => (isAdding = false)}>Annuler</button>
				<button class="btn btn-confirm" onclick={confirmAdd}>Confirmer</button>
			</div>
		</div>
	{/if}

	<table>
		<thead>
			<tr class="par-row">
				<th class="sticky-col"><strong>Par</strong></th>
				<th class="sticky-col"><strong>Règle</strong></th>
				<th class="action-header"></th>
			</tr>
		</thead>
		<tbody>
			{#each holesStore.list as hole, i}
				<tr class="scroll-area">
					<td>
						<Stepper label="" bind:value={hole.par} min={0} disabled={hole.rule === 'Bonus'} />
					</td>
					<td>
						<select id="rule{hole.id}" bind:value={hole.rule}>
							{#each ruleOptions as option}
								<option value={option}>{option}</option>
							{/each}
						</select>
					</td>
					<td>
						<button
							aria-label="Ouvrir le menu"
							class="btn-icon"
							onclick={() => toggleHoleDetails(i)}
							>{openedHoleIndex === i ? 'x' : '☰'}
						</button>
					</td>
				</tr>
				{#if openedHoleIndex === i}
					<tr>
						<td colspan="3">
							<div class="field-container">
								<Param label="Nom" type="text" bind:value={hole.name} />
								<button class="btn btn-suppress" onclick={() => confirmDeleteHole(i)}>
									Supprimer
								</button>
							</div>
						</td>
					</tr>
				{/if}
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
	.btn-icon {
		background: none;
		color: var(--primary);
		border: none;
		font-size: 1.2rem;
		cursor: pointer;
	}

	.btn-suppress {
		background-color: rgb(255, 120, 120);
		width: 50%;
		-webkit-tap-highlight-color: transparent;
		user-select: none;
		font-weight: bold;
		font-size: 1rem;
	}

	.btn-cancel {
		background-color: #ffaf87;
		width: 100%;
		-webkit-tap-highlight-color: transparent;
		user-select: none;
		margin-left: 20px;
		font-weight: bold;
		font-size: 1rem;
	}

	.btn-confirm {
		background-color: rgb(120, 255, 120);
		width: 100%;
		-webkit-tap-highlight-color: transparent;
		user-select: none;
		font-weight: bold;
		font-size: 1rem;
	}

	select {
		padding: 0.8rem;
		border: 1px solid #ccc;
		border-radius: 4px;
		font-size: 1rem;
	}

	.hole-config-box {
		background: var(--bg-card);
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		padding: 0.5rem 0;
		border-radius: 10px;
		margin-bottom: 1rem;
	}

	.actions {
		background: var(--bg-card);
		display: flex;
		width: 80%;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	.field-container {
		display: flex;
		flex-direction: column;
		gap: 8px;
		margin-bottom: 1.2rem;
		width: 100%;
	}
</style>
