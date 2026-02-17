<script lang="ts">
	interface Props {
		value: string;
		placeholder?: string;
		focus?: boolean;
	}

	let { value = $bindable(''), placeholder = '', focus = false }: Props = $props();
	let isEditing: boolean = $state(false);

	const init = (elt: any) => {
		if (focus) elt.focus();
	};

	const isFinished = (e: KeyboardEvent) => {
		if (e.key === 'Enter') {
			isEditing = !isEditing;
			// if (onchange) onchange();
		}
	};
</script>

<div>
	{#if isEditing}
		<input
			class="input-field"
			bind:value
			onblur={() => (isEditing = !isEditing)}
			onkeydown={(e) => isFinished(e)}
			onchange={() => (isEditing = !isEditing)}
		/>
	{:else}
		<div role="none" class="value-zone" onclick={() => (isEditing = !isEditing)}>
			{value}
		</div>
	{/if}
</div>

<style>
	.value-zone {
		min-width: 50px;
		border: 2px var(--bg-card) solid;
	}

	.input-field {
		background: none;
		border: none;
		width: 100%;
		padding: 0;
		font: inherit;
		cursor: pointer;
		color: inherit;
		border-bottom: 2px solid var(--primary);
		outline: none;
		color: var(--primary);
	}
</style>
