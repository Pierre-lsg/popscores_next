<script lang="ts">
	import { confirmStore } from '$lib/stores/confirmStore.svelte';
	import { fade, scale } from 'svelte/transition';
</script>

{#if confirmStore.isOpen}
	<div class="modal-backdrop" transition:fade={{ duration: 200 }}>
		<div
			class="modal-box"
			transition:scale={{ start: 0.95, duration: 200 }}
			role="dialog"
			aria-modal="true"
		>
			<h3 class="modal-title">Confirmation</h3>
			<p class="modal-message">{confirmStore.message}</p>
			
			<div class="modal-actions">
				<button class="btn btn-primary status-alert" onclick={() => confirmStore.respond(true)}>
					Valider
				</button>
				<button class="btn btn-secondary" onclick={() => confirmStore.respond(false)}>
					Annuler
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.modal-title {
		margin-top: 0;
		margin-bottom: 1rem;
		color: var(--primary);
	}

	.modal-message {
		margin-bottom: 1.5rem;
		font-size: 1.1rem;
		line-height: 1.4;
	}

	.modal-actions {
		display: flex;
		justify-content: space-around;
		gap: 1rem;
	}
	
	.btn-secondary {
		background-color: var(--bg-ui);
		color: var(--text-main);
		border: 1px solid var(--border-color);
	}
</style>
