<script lang="ts">
	import { base } from '$app/paths';
	import '../app.css';
	import { isMobile } from '$lib/stores/viewportStore';
	import { pwaInfo } from 'virtual:pwa-info';

	let { children } = $props();

	let webManifestLink = pwaInfo ? pwaInfo.webManifest.linkTag : '';
</script>

<svelte:head>
	{@html webManifestLink}
	<link rel="icon" href="{base}/favicon.ico" />
</svelte:head>

{@render children()}
