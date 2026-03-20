<script lang="ts">
	import Clubs from '$lib/views/championship/ClubsTeamsPlayers.svelte';
	import { securityCheck } from '$lib/utils/security';
	import { onMount } from 'svelte';

	onMount(() => {
		securityCheck();
	});
</script>

<Clubs />
