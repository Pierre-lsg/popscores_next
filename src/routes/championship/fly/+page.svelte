<script lang="ts">
	import FlyView from '$lib/views/fly/fly.svelte';
	import { securityCheck } from '$lib/utils/security';
	import { onMount } from 'svelte';

	onMount(() => {
		securityCheck();
	});
</script>

<FlyView />
