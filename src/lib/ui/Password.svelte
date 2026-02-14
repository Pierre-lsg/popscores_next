<script lang="ts">
	interface Props {
		label?: string;
		value: string;
		placeholder?: string;
	}

	let { label = '', value = $bindable(''), placeholder = '' }: Props = $props();

	// État interne pour basculer entre 'password' et 'text'
	let isVisible = $state(false);

	function toggleVisibility() {
		isVisible = !isVisible;
	}

	// Le type change dynamiquement selon l'état isVisible
	let inputType = $derived(isVisible ? 'text' : 'password');
</script>

<div class="field-container">
	{#if label}
		<label for="password-field">{label}</label>
	{/if}

	<div class="input-wrapper">
		<input id="password-field" type={inputType} {placeholder} bind:value />

		<button
			type="button"
			class="toggle-btn"
			onclick={toggleVisibility}
			tabindex="-1"
			aria-label={isVisible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
		>
			{#if isVisible}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					><path
						d="M17.94 17.94A10.07 10.07 0 0 1 12 19c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
					></path><line x1="1" y1="1" x2="23" y2="23"></line></svg
				>
			{:else}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle
						cx="12"
						cy="12"
						r="3"
					></circle></svg
				>
			{/if}
		</button>
	</div>
</div>

<style>
	.field-container {
		display: flex;
		flex-direction: column;
		gap: 8px;
		margin-bottom: 1.2rem;
		width: 100%;
	}

	.input-wrapper {
		position: relative;
		display: flex;
		align-items: center;
	}

	input {
		padding: 12px;
		border: 2px solid #e0e0e0;
		border-radius: 8px;
		font-size: 1rem;
		transition: border-color 0.2s;
		outline: none;
		width: 100%;
		background-color: var(--bg-ui);
	}

	.toggle-btn {
		position: absolute;
		right: 0.5rem;
		background: none;
		border: none;
		cursor: pointer;
		color: #555;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.2rem;
	}

	.toggle-btn:hover {
		color: #000;
	}
</style>
