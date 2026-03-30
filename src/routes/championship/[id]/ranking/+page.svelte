<script lang="ts">
	import ChampionshipRanking from '$lib/components/championship/ChampionshipRanking.svelte';
	import { securityCheck } from '$lib/utils/security';
	import { navContext } from '$lib/utils/nav.svelte';
	import { onMount } from 'svelte';
	import { base } from '$app/paths';
	import { selection } from '$lib/stores/selection';

	onMount(() => {
		securityCheck();

		navContext.headerAction = returnButton;
		navContext.title = 'Classement';
		return () => ((navContext.headerAction = null), (navContext.title = ''));
	});
</script>

{#snippet returnButton()}
	<a class="btn btn-back" href={base + '/championship/' + selection.currentId + '/'}>👑 Accueil</a>
{/snippet}

<ChampionshipRanking />
