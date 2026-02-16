<script lang="ts">
	interface Props {
		value: string;
		placeholder?: string;
		focus?: boolean;
		onchange?: () => void;
	}

	let { value = $bindable(''), placeholder = '', focus = false, onchange }: Props = $props();
	let isEditing: boolean = $state(false);

	const init = (elt: any) => {
		if (focus) elt.focus();
	};

	const isFinished = (e: KeyboardEvent) => {
		if (e.key === 'Enter') {
			isEditing = !isEditing;
			if (onchange) onchange(); // Call onchange if it's provided
		}
	};
</script>

<div>
	{#if isEditing}
		<input
			class="name-input"
			bind:value
			onblur={() => (isEditing = !isEditing)}
			onkeydown={(e) => isFinished(e)}
			{onchange}
		/>
	{:else}
		<div role="none" class="value-zone" onclick={() => (isEditing = !isEditing)}>
			{value}
		</div>
	{/if}
</div>

<style>
	.value-zone {
		/*border: 2px red solid;*/
	}
</style>
