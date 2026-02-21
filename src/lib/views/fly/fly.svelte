<script lang="ts">
	import type { Competition } from '$lib/types/competitionType';
	import type { Fly } from '$lib/types/flyType';
	import '$lib/styles/golfScoring.css';

	import CompetitionScoringEditSolo from '$lib/components/championship/competition/CompetitionScoringEditSolo.svelte';
	import CompetitionScoringEditTeams from '$lib/components/championship/competition/CompetitionScoringEditTeams.svelte';

	import { onMount } from 'svelte';
	import { isCompetitionTeam } from '$lib/utils/championship/competitionsFunctions.svelte';
	import { user } from '$lib/utils/pocketbase/pocketBase';
	import { competitionsStore } from '$lib/stores/championship/competitionsStore.svelte';
	import { flysChampionshipStore } from '$lib/stores/championship/flysChampionshipStore.svelte';

	let currentCompetition: Competition | undefined = $state(
		competitionsStore.list.find(
			(competition) => competition.startDate === new Date().toISOString().split('T')[0]
		)
	);
	let currentFly: Fly | undefined = $state();
	let flys: Fly[] = $state([]);

	onMount(() => {
		if (currentCompetition && $user) {
			//liste les flys de la compétition
			let Allflys = flysChampionshipStore.list.filter((fly) =>
				currentCompetition?.flysId.includes(fly.id)
			);
			flys = Allflys.filter((fly) => fly.supervisorId === $user.id);
		}

		if (flys.length === 1) currentFly = flys[0];
	});
</script>

<!-- Suivi d'une compétition -->
{#if currentCompetition}
	<p>Mode 'superviseur'</p>
	{#if flys.length === 0}
		<p>Aucun fly n'est à surveiller ...</p>
	{:else if flys.length === 1 || currentFly}
		{#if isCompetitionTeam(currentCompetition)}
			<CompetitionScoringEditTeams bind:currentCompetition bind:currentFly />
		{:else}
			<CompetitionScoringEditSolo bind:currentCompetition bind:currentFly />
		{/if}
	{:else}
		<p>Liste des flys pour sélection</p>
		{#each flys as fly}
			<div>{fly.id}</div>
		{/each}
	{/if}
{:else}{/if}
