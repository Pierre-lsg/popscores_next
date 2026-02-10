<script lang="ts">
	import type { Competition } from '$lib/types/competitionType';
	import type { Regulations } from '$lib/types/regulationsType';
	import CompetitionPlayersOnly from './CompetitionPlayersOnly.svelte';
	import CompetitionPlayersTeams from './CompetitionPlayersTeams.svelte';

	import { regulationsStore } from '$lib/stores/championship/regulationsStore.svelte';

	import CompetitionMenu from './CompetitionMenu.svelte';
	import { onMount } from 'svelte';

	let rules: Regulations | undefined = $state();

	let { currentCompetition = $bindable() } = $props<{
		currentCompetition: Competition | undefined;
	}>();

	// Chargement du paramétrage de la compétition
	onMount(() => {
		if (currentCompetition) {
			if (currentCompetition.regulationsId !== '')
				rules = regulationsStore.find(currentCompetition.regulationsId);
			if (!rules) {
				rules = regulationsStore.new();
				currentCompetition.regulationsId = rules.id;
			}
		}
		if (!currentCompetition.playersId) currentCompetition.playersId = [];
		if (!currentCompetition.teamsId) currentCompetition.teamsId = [];
	});
</script>

<div>
	<CompetitionMenu bind:currentCompetition />

	<h2>Lister les participants</h2>

	{#if rules?.teamGame}
		<!-- Compétition par équipe -->
		<CompetitionPlayersTeams bind:currentCompetition />
	{:else}
		<!-- Compétition individuelle -->
		<CompetitionPlayersOnly bind:currentCompetition />
	{/if}
</div>
