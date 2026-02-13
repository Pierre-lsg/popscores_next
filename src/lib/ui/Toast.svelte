<script lang="ts">
	import { toastStore } from '$lib/stores/toastStore.svelte';
	import { fly } from 'svelte/transition';
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
</style>
