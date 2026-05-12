<script lang="ts">
	import '../app.css';
	import { base } from '$app/paths';
	import { goto } from '$app/navigation';
	import { pwaInfo } from 'virtual:pwa-info';
	import { page } from '$app/stores';
	import ThemeSelector from '$lib/ui/ThemeSelector.svelte';
	import Toast from '$lib/ui/Toast.svelte';
	import ConfirmModal from '$lib/ui/ConfirmModal.svelte';
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
<ConfirmModal />

<main>
	<div class="top-bar">
		<div class="container-centered top-bar-content">
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
			<div class="top-bar-right">
				{#if $page.url.pathname.includes('/championship/')}
					<NetworkStatus />
					<StatusSignal />
				{/if}
				<ThemeSelector />
			</div>
		</div>
	</div>

	<div class="wrapper container-centered">
		{@render children()}
	</div>
</main>

<footer style="background-color: var(--bg-card)">
	<div class="container-centered footer-content">
		<span>Popscores v{CURRENT_VERSION}</span>
		{#if userStore.current}
			<span>🔗 {userStore.current.name} ({formatList(userStore.current.roles)})</span>
		{/if}
	</div>
</footer>

<style>
	.container-centered {
		max-width: 1200px;
		margin: 0 auto;
		width: 100%;
		padding: 0 1.5rem;
		box-sizing: border-box;
	}

	.top-bar {
		position: sticky;
		z-index: 999;
		height: 55px;
		top: 0; /* Collé en haut */
		width: 95%;
		max-width: 1200px;
		margin: 0 auto 1.5rem auto;
		background-color: var(--bg-card);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-top: none;
		border-bottom: 2px solid var(--bg-app); /* Gap de protection */
		border-radius: 0 0 20px 20px;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
		display: flex;
		align-items: center;
	}

	[data-theme='classic'] .top-bar,
	[data-theme='warm'] .top-bar,
	[data-theme='beach'] .top-bar {
		background-color: rgba(255, 255, 255, 0.7);
		border: 1px solid rgba(0, 0, 0, 0.1);
		border-top: none;
		border-bottom: 2px solid var(--bg-app);
	}

	.top-bar-content {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 100%;
		width: 100%;
		padding: 0 1rem;
	}

	.nav-wrapper {
		display: flex;
		align-items: center;
		flex-grow: 1;
	}

	.top-bar-right {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.wrapper {
		padding: 0.5rem 0;
		margin-bottom: 8vh;
	}

	.title {
		text-align: center;
		flex-grow: 1;
		color: var(--primary);
		font-size: 1.4rem;
		font-weight: bold;
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	footer {
		position: fixed;
		bottom: 0; /* Collé en bas */
		left: 50%;
		transform: translateX(-50%);
		z-index: 999;
		height: 45px;
		width: 95%;
		max-width: 1200px;
		background-color: rgba(30, 30, 30, 0.7);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-bottom: none;
		border-top: 2px solid var(--bg-app); /* Gap de protection */
		border-radius: 16px 16px 0 0;
		box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.2);
		display: flex;
		align-items: center;
		font-size: 0.85rem;
		color: var(--text-main);
	}

	[data-theme='classic'] footer,
	[data-theme='warm'] footer,
	[data-theme='beach'] footer {
		background-color: rgba(255, 255, 255, 0.7);
		border: 1px solid rgba(0, 0, 0, 0.1);
		border-bottom: none;
		border-top: 2px solid var(--bg-app);
	}

	.footer-content {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		padding: 0 1.5rem;
	}

	@media (max-width: 768px) {
		.top-bar {
			height: 50px;
			width: 100%; /* Pleine largeur sur mobile pour plus d'espace */
			border-radius: 0;
		}
		footer {
			height: 45px;
			width: 100%; /* Pleine largeur sur mobile */
			border-radius: 0;
		}
		.title {
			font-size: 1.1rem;
		}
	}
</style>
