<script lang="ts">
	import type { Competition } from '$lib/types/competitionType';
	import CompetitionGreetingsSolo from './CompetitionGreetingsSolo.svelte';
	import CompetitionGreetingsTeams from './CompetitionGreetingsTeams.svelte';
	import CompetitionMenu from './CompetitionMenu.svelte';
	import { isCompetitionTeam } from '$lib/utils/championship/competitionsFunctions.svelte';

	let { currentCompetition = $bindable() } = $props<{
		currentCompetition: Competition | undefined;
	}>();
</script>

<div>
	<CompetitionMenu bind:currentCompetition />
	<h2>Valider la compétition et partager</h2>
	<p>Puisqu'on toutes les cartes de scores</p>
	<p>Calculer et afficher le résultat final</p>
	<p>En cas d'égalité sur les 3 premières places, ajouter une cible pour départager</p>
	<p>Calculer le classement du championnat</p>

	{#if isCompetitionTeam(currentCompetition)}
		<!-- Compétition en équipe -->
		<CompetitionGreetingsTeams {currentCompetition} />
	{:else}
		<!-- Compétition individuelle -->
		<CompetitionGreetingsSolo {currentCompetition} />
	{/if}
</div>
