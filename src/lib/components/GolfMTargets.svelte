<script lang="ts">
	import Stepper from '$lib/ui/Stepper.svelte';
	import Param from '$lib/ui/Param.svelte';

	import { slide } from 'svelte/transition';
	import { fly } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { dndzone } from 'svelte-dnd-action';

	import { targetsStore } from '$lib/stores/targetsStore.svelte';
	import { playersStore } from '$lib/stores/playersStore.svelte';
	import { gameStatus } from '$lib/stores/gameStatusStore.svelte';

	const ruleOptions = ['Individuel', 'Scramble', 'Greensome', 'Chapman', 'Foursome', 'Bonus'];
	const flipDurationMs = 300;

	let editingId = $state<string | null>(null);
	let isDragging = $state(false);
	let newTargetName = $state('Trou');
	let newTargetRule = $state(ruleOptions[0]); // Règle par défaut

	function addTarget() {
		targetsStore.add(newTargetRule === 'bonus' ? 0 : 4, newTargetName, newTargetRule);
		gameStatus.currentTargetIndex = 0;
	}

	function handleRemoveDrop(e: CustomEvent<{ items: any[] }>) {
		const removedItem = e.detail.items[0];
		if (removedItem) {
			targetsStore.list = targetsStore.list.filter((h) => h.id !== removedItem.id);
		}
		gameStatus.currentTargetIndex = 0;
		isDragging = false;
	}

	function handleConsider() {
		isDragging = true;
	}
	function handleFinalize(e: CustomEvent<{ items: any[] }>) {
		targetsStore.list = e.detail.items;
		isDragging = false;
	}

	function editTargetName(id: string) {
		editingId = id;
	}

	function saveName(e: Event) {
		// Dès qu'on perd le focus (blur) ou appuie sur Entrée
		editingId = null;
	}
	function focus(node: HTMLInputElement) {
		node.focus();
		node.select(); // Optionnel : sélectionne tout le texte pour écraser vite
	}
</script>

<div class="step-content" in:slide>
	<button onclick={() => addTarget()} class="btn btn-primary">Ajouter un Trou ≡</button>

	<div
		class="targets-list"
		use:dndzone={{
			items: targetsStore.list,
			flipDurationMs,
			dropTargetStyle: { outline: '2px dashed var(--primary)', borderRadius: '8px' }
		}}
		onconsider={(e) => {
			handleConsider();
			targetsStore.list = e.detail.items;
		}}
		onfinalize={handleFinalize}
	>
		{#each targetsStore.list as target (target.id)}
			<div class="target-item" animate:flip={{ duration: flipDurationMs }}>
				<div class="content">
					{#if editingId === target.id}
						<input
							class="name-input"
							bind:value={target.name}
							onblur={saveName}
							onkeydown={(e) => e.key === 'Enter' && saveName(e)}
							use:focus
						/>
					{:else}
						<button
							class="content-edit-item invisible-button"
							onclick={() => editTargetName(target.id)}
						>
							{target.name || `Trou ${targetsStore.list.indexOf(target) + 1}`}
						</button>
					{/if}
					<Stepper label="" bind:value={target.par} min={0} disabled={target.rule === 'Bonus'} />
					<select id="rule{target.id}" bind:value={target.rule}>
						{#each ruleOptions as option}
							<option value={option}>{option}</option>
						{/each}
					</select>
				</div>
				<div class="handle">☰</div>
			</div>
		{/each}
	</div>

	{#if isDragging}
		<div
			transition:fly={{ x: 100, duration: 300 }}
			class="delete-zone"
			use:dndzone={{ items: [] }}
			onfinalize={handleRemoveDrop}
		>
			<div class="trash-icon">🗑️</div>
			<p>Lâcher pour supprimer</p>
		</div>
	{/if}
</div>

<style>
	.btn {
		width: 100%;
		-webkit-tap-highlight-color: transparent;
		user-select: none;
		font-weight: bold;
		font-size: 1.2rem;
	}

	select {
		padding: 0.1rem;
		width: 6.5rem;
		height: 2rem;
		border: 1px solid #ccc;
		border-radius: 4px;
		font-size: 1rem;
	}

	.targets-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		min-height: 50px; /* Important pour pouvoir redéposer dans une liste vide */
	}

	.target-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: var(--bg-card);
		border: 1px solid var(--border-color);
		border-radius: 8px;
		padding: 0.5rem;
		touch-action: shadow; /* Aide à la gestion tactile */
	}

	.handle {
		padding: 0 0 0 0.5rem;
		width: 5%;
		text-align: center;
		cursor: grab;
		color: var(--text-muted);
		user-select: none;
	}

	.content {
		display: flex;
		flex-direction: row;
		width: 95%;
		align-items: center;
		overflow: hidden;
		justify-content: space-between;
	}

	.content-edit-item {
		/* Pour le texte : points de suspension si trop long */
		display: -webkit-box;
		-line-clamp: 1; /* Limite à une seule ligne */
		-webkit-box-orient: vertical;
		overflow: hidden;
		text-overflow: ellipsis;

		height: 1.2em; /* On réserve l'espace exact d'une ligne */
		width: 4em;
	}

	.delete-zone {
		margin-top: 1rem;
		background: rgba(255, 0, 0, 0.149);
		color: white;
		border: red 2px dashed;
	}

	.invisible-button,
	.name-input {
		background: none;
		border: none;
		width: 100%;
		padding: 0;
		font: inherit;
		cursor: pointer;
		color: inherit;
	}

	.name-input {
		border-bottom: 2px solid var(--primary);
		outline: none;
		color: var(--primary);
	}
</style>
