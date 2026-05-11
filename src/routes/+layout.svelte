<script lang="ts">
	import '../app.css';
	import { base } from '$app/paths';
	import { goto } from '$app/navigation';
	import { pwaInfo } from 'virtual:pwa-info';
	import { page } from '$app/stores';
	import ThemeSelector from '$lib/ui/ThemeSelector.svelte';
	import Toast from '$lib/ui/Toast.svelte';
	import { toastStore } from '$lib/stores/toastStore.svelte';
	import { formatList } from '$lib/utils/sharedFunction';
	import { checkDataVersion, CURRENT_VERSION } from '$lib/utils/migration';
	import { userStore } from '$lib/stores/userStore.svelte';
	import { onMount } from 'svelte';
	import StatusSignal from '$lib/ui/InfoStatus.svelte';
	import NetworkStatus from '$lib/ui/NetworkStatus.svelte';
	import { pb } from '$lib/utils/pocketbase/pocketBase';
	import { navContext } from '$lib/utils/nav.svelte';

	let { children } = $props();

	let webManifestLink = pwaInfo ? pwaInfo.webManifest.linkTag : '';

	const logoutAndPurge = () => {
		userStore.current = null;
		localStorage.clear();
		pb.authStore.clear();
		goto(base + '/');
	};

	onMount(() => {
		const hasMigrated = checkDataVersion();
		if (hasMigrated) {
			toastStore.show('Application mise à jour', 'neutral', 5000);
			window.location.reload();
		}
	});
</script>

<svelte:head>
	<!--{@html webManifestLink}-->
	<link rel="manifest" href="{base}/manifest.webmanifest" />
	<link rel="icon" href="{base}/favicon.ico" />
</svelte:head>

<Toast />

<main>
	<div class="top-bar">
		<div class="nav-wrapper">
			<div style="width: 105px">
				{#if navContext.headerAction}
					{@render navContext.headerAction()}
				{:else}
					<a class="btn btn-back" href={base + '/'}>🏠 Accueil</a>
				{/if}
			</div>
			<div class="title">
				{#if navContext.title && navContext.title !== ''}
					{navContext.title}
				{:else}
					Popscores
				{/if}
			</div>
			<div style="width: 95px">&nbsp;</div>
		</div>
		{#if $page.url.pathname.includes('/championship/')}
			<NetworkStatus />
			<StatusSignal />
		{/if}
		<ThemeSelector />
	</div>

	<div class="wrapper">
		{@render children()}
	</div>
</main>

<footer style="background-color: var(--bg-card)">
	Popscores v{CURRENT_VERSION}
	{#if userStore.current}🔗{userStore.current.name} ({formatList(userStore.current.roles)})
	{/if}
	<!--
		<span role="none" onclick={() => logoutAndPurge()}>🗝️</span>
	-->
</footer>

<style>
	.top-bar {
		display: flex;
		justify-content: space-between;
		position: sticky;
		z-index: 999;
		height: 65px;
		top: 0;
		align-items: center;
		margin-bottom: 0.5rem;
		width: 100%;
		background-color: var(--bg-card);
	}

	.nav-wrapper {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		width: 100%;
	}

	.wrapper {
		display: flex;
		flex-direction: column;
		max-width: 1200px;
		padding: 0 0.5rem 0.5rem 0.5rem;
		margin-bottom: 3vh;
	}

	.title {
		align-items: center;
		text-align: center;
		width: 14rem;
		color: var(--primary);
		font-size: 1.5rem;
		font-weight: bold;
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
