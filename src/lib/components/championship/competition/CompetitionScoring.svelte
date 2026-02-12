<script lang="ts">
	import type { Competition } from '$lib/types/competitionType';
	import type { Fly } from '$lib/types/flyType';
	import type { Regulations } from '$lib/types/regulationsType';
	import { regulationsStore } from '$lib/stores/championship/regulationsStore.svelte';
	import CompetitionScoringList from './CompetitionScoringList.svelte';
	import CompetitionScoringEditSolo from './CompetitionScoringEditSolo.svelte';
	import CompetitionScoringEditTeams from './CompetitionScoringEditTeams.svelte';
	import { onMount } from 'svelte';
	import '$lib/styles/golfMScoring.css';

	let { currentCompetition = $bindable() } = $props<{
		currentCompetition: Competition | undefined;
	}>();

	let rules: Regulations | undefined = $state();
	let currentFly: Fly | undefined = $state();

	onMount(() => {
		if (currentCompetition) {
			if (currentCompetition.regulationsId !== '')
				rules = regulationsStore.find(currentCompetition.regulationsId);
			if (!rules) {
				rules = regulationsStore.new();
				currentCompetition.regulationsId = rules.id;
			}
		}
	});
</script>

{#if currentFly === undefined}
	<!-- Gestion des compétitions -->
	<CompetitionScoringList bind:currentCompetition bind:currentFly />
{:else}
	<!-- Suivi d'une compétition -->
	{#if rules?.teamGame}
		<CompetitionScoringEditTeams bind:currentCompetition bind:currentFly />
	{:else}
		<CompetitionScoringEditSolo bind:currentCompetition bind:currentFly />
	{/if}
{/if}
