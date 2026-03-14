<script lang="ts">
	interface Props {
		id?: string;
		value: string[]; // Changement : c'est un tableau
		label?: string;
		options: string[];
		optionsLabel?: string[];
		onchange?: () => void;
	}

	let {
		id = '',
		value = $bindable([]), // Initialisé par un tableau vide
		label = '',
		options = [],
		optionsLabel = [],
		onchange
	}: Props = $props();

	// Plus propre que onMount : on génère les objets automatiquement
	let opts = $derived(
		options.map((id, i) => ({
			id,
			label: optionsLabel[i] ?? id
		}))
	);

	function toggleOption(optionId: string) {
		if (value.includes(optionId)) {
			value = value.filter((v) => v !== optionId);
		} else {
			value = [...value, optionId];
		}
		if (onchange) onchange();
	}
</script>

<div class="multi-select-container">
	{#if label}<div class="main-label">{label}</div>{/if}

	<div class="options-grid">
		{#each opts as option}
			<button
				type="button"
				class="chip"
				class:active={value.includes(option.id)}
				onclick={() => toggleOption(option.id)}
			>
				{option.label}
				{#if value.includes(option.id)}
					<span class="icon">✓</span>
				{/if}
			</button>
		{/each}
	</div>
</div>

<style>
	.multi-select-container {
		width: 100%;
		background: var(--bg-card);
		border-radius: 8px;
		margin-bottom: 0.5rem;
		padding: 0.75rem;
	}

	.main-label {
		font-weight: bold;
		margin-bottom: 0.5rem;
		color: var(--text-main);
	}

	.options-grid {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.chip {
		padding: 0.5rem 1rem;
		border-radius: 20px;
		border: 1px solid var(--text-main);
		background: transparent;
		color: var(--text-main);
		font-size: 0.9rem;
		cursor: pointer;
		transition: all 0.2s;
		display: flex;
		align-items: center;
		gap: 0.4rem;
	}

	.chip.active {
		background: var(--text-main);
		color: var(--bg-card);
		border-color: var(--text-main);
	}

	.icon {
		font-size: 0.8rem;
	}
</style>
