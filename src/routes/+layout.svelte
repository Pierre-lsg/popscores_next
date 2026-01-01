<script lang="ts">
	import '../app.css';
	import { base } from '$app/paths';
	import { pwaInfo } from 'virtual:pwa-info';

	let { children } = $props();

	let webManifestLink = pwaInfo ? pwaInfo.webManifest.linkTag : '';
</script>

<svelte:head>
	{@html webManifestLink}
	<link rel="icon" href="{base}/favicon.ico" />
</svelte:head>

{@render children()}
