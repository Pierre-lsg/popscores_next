<script lang="ts">
	import CompetitionManagement from '$lib/components/championship/competition/CompetitionManagement.svelte';
	import CompetitionsList from '$lib/components/championship/competition/CompetitionsList.svelte';
	import type { Competition } from '$lib/types/competitionType';
	import type { Championship } from '$lib/types/championshipType';

	import { onMount } from 'svelte';
	import { navContext } from '$lib/utils/nav.svelte';
	import { base } from '$app/paths';
	import { selection } from '$lib/stores/selection';

	let championship = $state(selection.currentChampionship || ({} as Championship));

	let currentCompetition: Competition | undefined = $state();

	onMount(() => {
		navContext.headerAction = returnButton;
		navContext.title = 'Championnat';
		return () => ((navContext.headerAction = null), (navContext.title = ''));
	});
</script>

{#snippet returnButton()}
	{#if !currentCompetition}
		<a class="btn btn-back" href={base + '/championship/' + selection.currentId + '/'}>👑 Accueil</a
		>
	{:else}
		<span class="btn btn-back" role="none" onclick={() => (currentCompetition = undefined)}>
			⛳ Accueil
		</span>
	{/if}
{/snippet}

{#if currentCompetition === undefined}
	<!-- Gestion des compétitions -->
	<CompetitionsList bind:currentCompetition bind:championship />
{:else}
	<!-- Suivi d'une compétition -->
	<CompetitionManagement bind:currentCompetition bind:championship />
{/if}
