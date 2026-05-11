<script lang="ts">
	import { toastStore } from '$lib/stores/toastStore.svelte';
	import { fly } from 'svelte/transition';
</script>

{#if toastStore.message}
	<div
		transition:fly={{ y: -50, duration: 300 }}
		class="toast-container status-{toastStore.status}"
		role="alert"
	>
		<span class="message">{toastStore.message}</span>
		{#if toastStore.isPersistent}
			<button class="close-btn" onclick={() => toastStore.dismiss()} aria-label="Fermer">
				✕
			</button>
		{/if}
	</div>
{/if}

<style>
	.toast-container {
		position: fixed;
		top: 1rem;
		left: 50%;
		transform: translateX(-50%);
		z-index: 1000;
		padding: 0.75rem 1.5rem;
		border-radius: 8px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
		display: flex;
		align-items: center;
		gap: 1rem;
		min-width: 300px;
		justify-content: space-between;
		font-weight: bold;
		font-size: 0.95rem;
	}

	.message {
		flex-grow: 1;
		text-align: center;
	}

	.close-btn {
		background: none;
		border: none;
		color: var(--text-on-status);
		font-size: 1.2rem;
		cursor: pointer;
		padding: 0 0.5rem;
		opacity: 0.8;
		transition: opacity 0.2s;
	}

	.close-btn:hover {
		opacity: 1;
	}
</style>
