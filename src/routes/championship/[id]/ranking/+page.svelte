<script lang="ts">
	import ChampionshipRanking from '$lib/components/ChampionshipRanking.svelte';
	import { securityCheck } from '$lib/utils/security';
	import { onMount } from 'svelte';

	onMount(() => {
		securityCheck();
	});
</script>

<ChampionshipRanking />
