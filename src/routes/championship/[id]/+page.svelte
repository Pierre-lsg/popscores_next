<script lang="ts">
	import { base } from '$app/paths';
	import GolfChampionship from '$lib/views/GolfChampionship.svelte';
	import type { Championship } from '$lib/types/championshipType';
	import { championshipStore } from '$lib/stores/championship/championshipsStore.svelte';
	import { securityCheck } from '$lib/utils/security';
	import { onMount } from 'svelte';
	import { selection } from '$lib/stores/selection';
	import { goto } from '$app/navigation';

	let currentChampionship: Championship | undefined = $state(
		championshipStore.list.find((c) => c.id === selection.currentId)
	);

	onMount(async () => {
		securityCheck();

		if (!currentChampionship) goto(base + '/championship');
	});
</script>

{#if currentChampionship}
	<GolfChampionship bind:currentChampionship />
{/if}
