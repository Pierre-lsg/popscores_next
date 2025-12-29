<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '../app.css';
	import { isMobile } from '$lib/stores/viewportStore';
	import { pwaInfo } from 'virtual:pwa-info';

	let { children } = $props();

	let webManifestLink = pwaInfo ? pwaInfo.webManifest.linkTag : '';
</script>

<svelte:head>
	{@html webManifestLink}
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
