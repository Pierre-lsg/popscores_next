<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		id?: string;
		value: string;
		label?: string;
		options: string[];
		optionsLabel?: string[];
		unselectedOption?: string;
		onchange?: () => void;
	}

	interface Options {
		id: string;
		label: string;
	}

	let {
		id = '',
		value = $bindable(''),
		label = '',
		options = [],
		optionsLabel = [],
		unselectedOption = '',
		onchange
	}: Props = $props();

	let opts: Options[] = $state([]);

	onMount(() => {
		for (let i = 0; i < options.length; i++) {
			opts.push({
				id: options[i],
				label: optionsLabel[i] ? optionsLabel[i] : options[i]
			});
		}
	});
</script>

<div class="select-container">
	{#if label}<label for={id}>{label}</label>{/if}

	<select {id} bind:value {onchange}>
		{#if unselectedOption !== ''}
			<option value="">{unselectedOption}</option>
		{/if}
		{#each opts as option}
			<option value={option.id}>{option.label}</option>
		{/each}
	</select>
</div>

<style>
	.select-container {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: var(--bg-card);
		border-radius: 8px;
		margin-bottom: 0.5rem;
		padding: 0.5rem 0;
	}

	option {
		color: var(--text-main);
	}

	select {
		color: var(--text-main);
		flex: 1;
		min-width: 0;
	}

	label {
		width: 50%;
	}
</style>
