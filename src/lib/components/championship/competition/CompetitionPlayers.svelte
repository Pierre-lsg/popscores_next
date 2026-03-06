<script lang="ts">
	import type { Competition } from '$lib/types/competitionType';
	import CompetitionPlayersOnly from './CompetitionPlayersOnly.svelte';
	import CompetitionPlayersTeams from './CompetitionPlayersTeams.svelte';
	import { isCompetitionTeam } from '$lib/utils/championship/competitionsFunctions.svelte';

	import CompetitionMenu from './CompetitionMenu.svelte';
	import type { Championship } from '$lib/types/championshipType';

	let { currentCompetition = $bindable(), championship = $bindable() } = $props<{
		currentCompetition: Competition | undefined;
		championship: Championship;
	}>();
</script>

<div>
	<CompetitionMenu bind:currentCompetition />

	<h2>Lister les participants</h2>

	{#if isCompetitionTeam(currentCompetition)}
		<!-- Compétition par équipe -->
		<CompetitionPlayersTeams bind:currentCompetition bind:championship />
	{:else}
		<!-- Compétition individuelle -->
		<CompetitionPlayersOnly bind:currentCompetition bind:championship />
	{/if}
</div>
