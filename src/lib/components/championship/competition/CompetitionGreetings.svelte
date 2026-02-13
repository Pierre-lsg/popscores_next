<script lang="ts">
	import type { Competition } from '$lib/types/competitionType';
	import type { Regulations } from '$lib/types/regulationsType';
	import { regulationsStore } from '$lib/stores/championship/regulationsStore.svelte';
	import CompetitionGreetingsSolo from './CompetitionGreetingsSolo.svelte';
	import CompetitionGreetingsTeams from './CompetitionGreetingsTeams.svelte';
	import CompetitionMenu from './CompetitionMenu.svelte';
	import { onMount } from 'svelte';

	let { currentCompetition = $bindable() } = $props<{
		currentCompetition: Competition | undefined;
	}>();

	let rules: Regulations | undefined = $state();

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

<div>
	<CompetitionMenu bind:currentCompetition />
	<h2>Valider la compétition et partager</h2>
	<p>Puisqu'on toutes les cartes de scores</p>
	<p>Calculer et afficher le résultat final</p>
	<p>En cas d'égalité sur les 3 premières places, ajouter une cible pour départager</p>
	<p>Calculer le classement du championnat</p>

	{#if rules?.teamGame}
		<!-- Compétition en équipe -->
		<CompetitionGreetingsTeams {currentCompetition} />
	{:else}
		<!-- Compétition individuelle -->
		<CompetitionGreetingsSolo {currentCompetition} />
	{/if}
</div>
