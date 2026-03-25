<script lang="ts">
	import Clubs from '$lib/views/championship/ClubsTeamsPlayers.svelte';
	import { securityCheck } from '$lib/utils/security';
	import { navContext } from '$lib/nav.svelte';
	import { onMount } from 'svelte';
	import { base } from '$app/paths';
	import { selection } from '$lib/stores/selection';

	onMount(() => {
		securityCheck();

		navContext.headerAction = returnButton;
		return () => (navContext.headerAction = null);
	});
</script>

{#snippet returnButton()}
	<a class="btn btn-back" href={base + '/championship/' + selection.currentId + '/'}>👑 Accueil</a>
{/snippet}

<Clubs />
