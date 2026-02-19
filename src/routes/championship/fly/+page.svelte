<script lang="ts">
	import FlyView from '$lib/views/fly/fly.svelte';
	import { securityCheck } from '$lib/utils/security';
	import { onMount } from 'svelte';
	import type { Competition } from '$lib/types/competitionType';
	import type { Fly } from '$lib/types/flyType';

	let currentCompetition: Competition = {} as Competition;
	let currentFly: Fly = {} as Fly;

	onMount(() => {
		securityCheck();
	});
</script>

{#if currentCompetition && currentFly}
	<FlyView {currentCompetition} {currentFly} />
{/if}
