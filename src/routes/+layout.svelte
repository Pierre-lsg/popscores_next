<script lang="ts">
	import '../app.css';
	import { base } from '$app/paths';
	import { pwaInfo } from 'virtual:pwa-info';
	import { page } from '$app/stores';
	import ThemeSelector from '$lib/ui/ThemeSelector.svelte';
	import NetworkBanner from '$lib/ui/NetworkBanner.svelte';
	import Toast from '$lib/ui/Toast.svelte';
	import { checkDataVersion, CURRENT_VERSION } from '$lib/utils/migration';
	import { onMount } from 'svelte';

	let { children } = $props();

	let webManifestLink = pwaInfo ? pwaInfo.webManifest.linkTag : '';

	onMount(() => {
		const hasMigrated = checkDataVersion();
		if (hasMigrated) {
			alert('Application mise à jour');
			window.location.reload();
		}
	});
</script>

<svelte:head>
	{@html webManifestLink}
	<link rel="icon" href="{base}/favicon.ico" />
</svelte:head>

<NetworkBanner />
<Toast />

<main>
	<div class="top-bar">
		<div class="nav-action">
			{#if $page.url.pathname.includes('/championship/') && $page.url.pathname !== '/championship/'}
				<a class="btn btn-back" href={base + '/championship'}>👑 Accueil</a>
			{:else}
				<a class="btn btn-back" href={base + '/'}>🏠 Accueil</a>
			{/if}
		</div>
		<ThemeSelector />
	</div>

	<div class="wrapper">
		{@render children()}
	</div>
</main>

<footer>
	Popscores v.{CURRENT_VERSION}
</footer>

<style>
	.top-bar {
		display: flex;
		justify-content: space-between;
		position: sticky;
		top: 0;
		z-index: 999;
		align-items: center;
		margin-bottom: 1rem;
		width: 100%;
		background-color: var(--bg-card);
	}

	.wrapper {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		max-width: 1200px;
		margin: 0 auto;
		padding: 0.5rem;
	}
</style>
