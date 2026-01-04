<script lang="ts">
	import { networkStatus } from '$lib/stores/networkStore.svelte';
	import { fade, slide } from 'svelte/transition';

	let showNetworkStatus = $state(false);

	$effect(() => {
		if (networkStatus.isOnline) {
			showNetworkStatus = true;
			const timer = setTimeout(() => {
				showNetworkStatus = false;
			}, 3000);

			return () => clearTimeout(timer);
		} else {
			showNetworkStatus = true;
			const timer = setTimeout(() => {
				showNetworkStatus = false;
			}, 3000);
			return () => clearTimeout(timer);
		}
	});
</script>

{#if showNetworkStatus && !networkStatus.isOnline}
	<div class="banner offline" transition:slide>
		<span>📡 Mode hors-ligne (les scores sont sauvés localement)</span>
	</div>
{/if}

{#if showNetworkStatus && networkStatus.isOnline}
	<div class="banner online" transition:fade>
		<span>✅ Connexion rétablie</span>
	</div>
{/if}

<style>
	.banner {
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
	.offline {
		background-color: #607d8b;
	}
	.online {
		background-color: var(--primary);
	}
</style>
