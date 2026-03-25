<script lang="ts">
	import { navContext } from '$lib/utils/nav.svelte';
	import { onMount } from 'svelte';
	import { base } from '$app/paths';
	import Hub from '$lib/views/Hub.svelte';

	onMount(() => {
		navContext.headerAction = returnButton;
		return () => (navContext.headerAction = null);
	});
</script>

{#snippet returnButton()}
	<a class="btn btn-back" href={base + '/'}>🏠 Accueil</a>
{/snippet}

<Hub />
