<script lang="ts">
	export let label = ''; // Le titre du champ
	export let value = ''; // La valeur liée (bind)
	export let type = 'text'; // text, number, etc.
	export let placeholder = ''; // Texte d'aide
	export let inputmode:
		| 'text'
		| 'search'
		| 'none'
		| 'tel'
		| 'url'
		| 'email'
		| 'numeric'
		| 'decimal' = 'text'; // Pour forcer le pavé numérique (ex: "numeric")
	export let focus = false;
	export let oneline = false;

	let contentAppearance: string = oneline ? 'param-inline-container' : 'param-container';

	const init = (elt: any) => {
		if (focus) elt.focus();
	};
</script>

<div class={contentAppearance}>
	{#if label}
		<label for="input-field">{label}</label>
	{/if}

	<input
		id="input-field"
		{type}
		{placeholder}
		{inputmode}
		bind:value
		on:input
		on:keydown
		use:init
	/>
	<slot />
</div>

<style>
	.param-container {
		display: flex;
		flex-direction: column;
		gap: 8px;
		margin-bottom: 1.2rem;
		width: 100%;
	}

	.param-inline-container {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.5rem;
		background: var(--bg-card);
		border-radius: 8px;
		margin-bottom: 0.5rem;
	}

	label {
		font-weight: 600;
		font-size: 1rem;
		color: var(--color-text-soft, #555);
		text-align: left;
	}

	input {
		padding: 12px;
		border: 2px solid #e0e0e0;
		border-radius: 8px;
		font-size: 1rem;
		transition: border-color 0.2s;
		outline: none;
		background-color: var(--bg-ui);
	}

	input:focus {
		border-color: var(--border-color);
	}

	/* Style spécifique pour le mode sombre si tu l'utilises */
	:global(.dark-mode) input {
		background: #222;
		color: white;
		border-color: var(--border-color);
	}
</style>
