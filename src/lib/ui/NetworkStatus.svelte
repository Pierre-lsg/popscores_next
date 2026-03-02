<script lang="ts">
	import { networkStatus } from '$lib/stores/networkStore.svelte';

	let isOnline: boolean = $state(true);

	$effect(() => {
		if (networkStatus.isOnline) isOnline = true;
		else isOnline = false;
	});
</script>

<div class="status-wrapper">
	{#if isOnline}
		🌐
	{:else}
		🔌
	{/if}
</div>

<style>
	.status-wrapper {
		position: fixed;
		top: 2.7rem;
		right: 5.5rem;
		z-index: 2000;
	}
</style>
