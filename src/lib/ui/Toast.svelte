<script lang="ts">
	import { toastStore } from '$lib/stores/toastStore.svelte';
	import { fade, fly } from 'svelte/transition';
</script>

{#if toastStore.message}
	<button
		transition:fly={{ y: 0, duration: 300 }}
		class="toast-button {toastStore.status}"
		onclick={() => toastStore.dismiss()}
	>
		{toastStore.message}
	</button>{/if}

<style>
	.toast-button {
		/* On annule le style par défaut du bouton */
		border: none;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 1000;
		padding: 0.5rem;
		text-align: center;
		font-size: 0.9rem;
		font-weight: bold;
		color: white;
	}

	.success {
		background: #248724;
	}

	.failure {
		background: #ff3030;
	}

	.warning {
		background: #ff7f30;
	}

	/*
	.toast-button {
		background: var(--primary);
		color: white;
		border: none;
		padding: 0.8rem 1.5rem;
		border-radius: 8px;
		cursor: pointer;
		position: fixed;
		bottom: 2rem;
		left: 50%;
		transform: translateX(-50%);
	}
*/
</style>
