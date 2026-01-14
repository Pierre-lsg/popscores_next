<script>
	export let value = '';
	export let label = '';
	export let icon = '';

</script>

<label for="date-picker">{label}</label>
<div class="field-container">
	<span class="icon">{icon}</span>
	<input 
		id="date-picker"
		type="date" 
		bind:value
	/>
</div>

<style>
	.field-container {
		display: flex;
		flex-direction: column;
		gap: 8px;
		margin-bottom: 1.2rem;
		width: 100%;
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
	}

</style>
