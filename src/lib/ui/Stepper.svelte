<script lang="ts">
	export let value: number = 0;
	export let min: number = 0;
	export let max: number | undefined = undefined;
	export let label: string = '';
	export let disabled: boolean = false;
</script>

<div class="stepper-container">
	{#if label}<span class="label">{label}</span>{/if}
	<div class="controls">
		<button on:click={() => value > min && value--} class="btn-step" {disabled}>-</button>
		<div class="value-display">{value}</div>
		<button
			on:click={() => value < (max === undefined ? Infinity : max) && value++}
			class="btn-step"
			{disabled}>+</button
		>
	</div>
</div>

<style>
	.stepper-container {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.5rem;
		background: var(--bg-card);
		border-radius: 8px;
		margin-bottom: 0.5rem;
	}
	.controls {
		display: flex;
		align-items: center;
		gap: 1rem;
	}
	.btn-step {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		border: 1px solid var(--primary);
		background: white;
		font-size: 1.5rem;
		color: var(--primary);
		touch-action: manipulation;
	}
	.value-display {
		font-size: 1.2rem;
		font-weight: bold;
		min-width: 30px;
		text-align: center;
	}
</style>
