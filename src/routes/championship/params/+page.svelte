<script lang="ts">
	import ChampionshipParams from '$lib/views/championship/ChampionshipParams.svelte';
	import { securityCheck } from '$lib/utils/security';
	import { onMount } from 'svelte';

	onMount(() => {
		securityCheck();
	});
</script>

<ChampionshipParams />
