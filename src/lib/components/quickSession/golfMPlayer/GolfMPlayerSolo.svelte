<script lang="ts">
	import { slide, fly } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { playersStore } from '$lib/stores/quickSession/playersStore.svelte';
	import { smartSort } from '$lib/utils/sharedFunction';
	import { dndzone } from 'svelte-dnd-action';
	import TextField from '$lib/ui/TextField.svelte';

	const flipDurationMs = 300;

	let isDragging: boolean = $state(false);
	let isSortPlayerAsc: boolean = true;

	let editingId = $state<string | null>(null);

	const addPlayer = () => {
		playersStore.add('Joueur #' + (playersStore.list.length + 1));
	};

	const handleRemoveDrop = (e: CustomEvent<{ items: any[] }>) => {
		const removedItem = e.detail.items[0];
		if (removedItem) {
			playersStore.list = playersStore.list.filter((h) => h.id !== removedItem.id);
		}
		isDragging = false;
	};

	const handleConsider = () => {
		isDragging = true;
	};
	const handleFinalize = (e: CustomEvent<{ items: any[] }>) => {
		playersStore.list = e.detail.items;
		isDragging = false;
	};

	const sortPlayersByPlayer = () => {
		playersStore.list = smartSort(playersStore.list, 'name', isSortPlayerAsc);
		isSortPlayerAsc = !isSortPlayerAsc;
	};

	const editPlayerName = (id: string) => {
		editingId = id;
	};

	const saveName = (e: Event) => {
		editingId = null;
	};
	const focus = (node: HTMLInputElement) => {
		node.focus();
		node.select();
	};
</script>

<div class="step-content" in:slide>
	<button onclick={addPlayer} class="btn btn-primary">Ajouter un Joueur</button>

	<div class="card-list">
		<!-- Liste des joueurs -->
		<div class="players-header">
			<button class="invisible-button player-item-header" onclick={() => sortPlayersByPlayer()}
				>Joueurs</button
			>
		</div>

		<div
			class="players-list"
			use:dndzone={{
				items: playersStore.list,
				flipDurationMs,
				dropTargetStyle: { outline: '2px dashed var(--primary)', borderRadius: '8px' }
			}}
			onconsider={(e) => {
				handleConsider();
				playersStore.list = e.detail.items;
			}}
			onfinalize={handleFinalize}
		>
			{#each playersStore.list as player (player.id)}
				<div class="player-item" animate:flip={{ duration: flipDurationMs }}>
					<div class="content">
						<TextField bind:value={player.name} />
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
</div>

<style>
	.players-header {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		border-radius: 8px;
		background: var(--bg-card);
		margin: 0 0 0.5rem 0;
		gap: 0.5rem;
		min-height: 50px;
	}

	.player-item-header {
		padding: 0 5rem 0 2rem;
		gap: 0.5rem;
		min-height: 50px;
	}

	.player-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: var(--bg-card);
		border: 1px solid var(--border-color);
		border-radius: 8px;
		padding: 0.5rem;
		touch-action: shadow;
	}
</style>
