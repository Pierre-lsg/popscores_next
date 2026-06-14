<script lang="ts">
	interface Props {
		label?: string;
		value: string;
		type?: 'text' | 'number';
		placeholder?: string;
		inputmode?: 'text' | 'search' | 'none' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal';
		focus?: boolean;
		oneline?: boolean;
		onchange?: () => void;
	}

	let {
		label = '',
		value = $bindable(''),
		type = 'text',
		placeholder = '',
		inputmode = 'text',
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

	<input id="input-field" {type} {placeholder} {inputmode} bind:value use:init {onchange} />
</div>
