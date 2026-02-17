<script lang="ts">
	import GolfChampionship from '$lib/views/GolfChampionship.svelte';

	import { securityCheck } from '$lib/utils/security';
	import { onMount } from 'svelte';

	onMount(() => {
		securityCheck();
	});
</script>

<GolfChampionship />
