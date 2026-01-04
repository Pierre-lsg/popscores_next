<script lang="ts">
	import { toastStore } from '$lib/stores/toastStore.svelte';
	import { fade, fly } from 'svelte/transition';
</script>

{#if toastStore.message}
	<button
		transition:fly={{ y: 50, duration: 300 }}
		class="toast-button"
		onclick={() => toastStore.dismiss()}
	>
		{toastStore.message}
	</button>{/if}

<style>
	.toast-button {
		/* On annule le style par défaut du bouton */
		background: var(--primary);
		color: white;
		border: none;
		padding: 0.8rem 1.5rem;
		border-radius: 8px;
		cursor: pointer;
		/* Positionnement */
		position: fixed;
		bottom: 2rem;
		left: 50%;
		transform: translateX(-50%);
	}
</style>
