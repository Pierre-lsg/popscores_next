<script lang="ts">
	import { router } from '$lib/stores/routerStore.svelte';

	import Hub from '$lib/views/Hub.svelte';
	import GolfGame from '$lib/views/GolfGame.svelte';
	import History from '$lib/views/History.svelte';
	import Params from '$lib/views/Params.svelte';

	import ThemeSelector from '$lib/ui/ThemeSelector.svelte';
	import NetworkBanner from '$lib/ui/NetworkBanner.svelte';
</script>

<NetworkBanner />

<main>
	<div class="top-bar">
		<div class="nav-action">
			{#if router.current !== 'hub' }
				<button class="btn btn-back" onclick={() => router.goTo('hub')}> ← Retour au Hub </button>
			{:else}
				<span></span>
			{/if}
		</div>

		<ThemeSelector />
	</div>

	{#if router.current === 'hub'}
		<Hub />
	{:else if router.current === 'golf-score'}
		<GolfGame />
	{:else if router.current === 'params'}
		<Params />
	{:else if router.current === 'golf-history'}
		<History />
	{/if}
</main>

<style>
	.top-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rem;
		width: 100%;
	}

	.btn-back {
		margin: 1rem;
		background: none;
		border: none;
		color: var(--primary);
		cursor: pointer;
		padding: 0.5rem 1rem;
		font-size: 0.9rem;
		font-weight: bold;
	}
</style>
