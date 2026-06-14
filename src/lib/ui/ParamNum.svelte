<script lang="ts">
	interface Props {
		label?: string;
		value: number;
		placeholder?: string;
		inputmode?: 'numeric' | 'decimal';
		focus?: boolean;
		oneline?: boolean;
		onchange?: () => void;
	}

	let {
		label = '',
		value = $bindable(0),
		placeholder = '',
		inputmode = 'numeric',
		focus = false,
		oneline = false,
		onchange
	}: Props = $props();

	let contentAppearance = $derived(oneline ? 'param-inline-container' : 'param-container');

	const init = (elt: HTMLInputElement) => {
		if (focus) elt.focus();
	};
</script>

<div class={contentAppearance}>
	{#if label}
		<label for="input-field">{label}</label>
	{/if}

	<input id="input-field" {placeholder} {inputmode} bind:value use:init {onchange} />
</div>
