<script lang="ts">
	import '../app.css';
	import { base } from '$app/paths';
	import { pwaInfo } from 'virtual:pwa-info';
	import { page } from '$app/stores';
	import ThemeSelector from '$lib/ui/ThemeSelector.svelte';
	import NetworkBanner from '$lib/ui/NetworkBanner.svelte';
	import Toast from '$lib/ui/Toast.svelte';
	import { formatList } from '$lib/utils/sharedFunction';
	import { checkDataVersion, CURRENT_VERSION } from '$lib/utils/migration';
	import { user } from '$lib/utils/pocketbase/pocketBase';
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
		<div>
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

<footer style="background-color: var(--bg-card)">
	Popscores v{CURRENT_VERSION}
	{#if $user}🔗{$user.name} ({formatList($user.roles)})
	{/if}
</footer>

<style>
	.top-bar {
		display: flex;
		justify-content: space-between;
		position: sticky;
		height: 7vh;
		z-index: 999;
		top: 0;
		align-items: center;
		margin-bottom: 0.5rem;
		width: 100%;
		background-color: var(--bg-card);
	}

	.wrapper {
		display: flex;
		flex-direction: column;
		max-width: 1200px;
		padding: 0 0.5rem 0.5rem 0.5rem;
		margin-bottom: 3vh;
	}

	footer {
		display: flex;
		position: fixed;
		z-index: 999;
		top: 97vh;
		height: 3vh;
		width: 100vw;
		background-color: var(--bg-ui);
	}
</style>
