<script lang="ts">
	import Competitions from '$lib/views/championship/Competitions.svelte';
	import { securityCheck } from '$lib/utils/security';
	import { onMount } from 'svelte';

	onMount(() => {
		securityCheck();
	});
</script>

<Competitions />
