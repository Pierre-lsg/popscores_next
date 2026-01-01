<script lang="ts">
	import { currentPage } from '$lib/stores/routerStore';

	import Hub from '$lib/views/Hub.svelte';
	import GolfGame from '$lib/views/GolfGame.svelte';
	import Params from '$lib/views/Params.svelte';

	import ThemeSelector from '$lib/ui/ThemeSelector.svelte';
	import NetworkBanner from '$lib/ui/NetworkBanner.svelte';
	// On écoute la page courante
	$: page = $currentPage;
</script>

<NetworkBanner />

<main>
	<div class="top-bar">
		<div class="nav-action">
			{#if page === 'golf-score' || page === 'params'}
				<button class="btn btn-back" on:click={() => currentPage.set('hub')}>
					← Retour au Hub
				</button>
			{:else}
				<span></span>
			{/if}
		</div>

		<ThemeSelector />
	</div>

	{#if page === 'hub'}
		<Hub />
	{:else if page === 'golf-score'}
		<GolfGame />
	{:else if page === 'params'}
		<Params />
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
