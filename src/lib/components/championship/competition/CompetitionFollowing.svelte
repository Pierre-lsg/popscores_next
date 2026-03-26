<script lang="ts">
	import type { Competition } from '$lib/types/competitionType';
	import CompetitionMenu from './CompetitionMenu.svelte';
	import { cloudLoadCompetitionScoreCards } from '$lib/utils/championship/competitionsFunctions.svelte';
	import { onMount } from 'svelte';
	import type { ScoreCard } from '$lib/types/scoreCardType';
	import { isCompetitionTeam } from '$lib/utils/championship/competitionsFunctions.svelte';
	import TeamScoreCard from '$lib/ui/TeamScoreCard.svelte';
	import PlayerScoreCard from '$lib/ui/PlayerScoreCard.svelte';

	let { currentCompetition = $bindable() } = $props<{
		currentCompetition: Competition | undefined;
	}>();

	let scoreCards: ScoreCard[] = $state([]);

	onMount(async () => {
		scoreCards = await cloudLoadCompetitionScoreCards(currentCompetition.id);
	});
</script>

<div>
	<h2>Suivre les résultats en temps réel</h2>

	<CompetitionMenu bind:currentCompetition />

	{#each scoreCards as scoreCard}
		{#if isCompetitionTeam(currentCompetition)}
			<h3>Fly #{scoreCard.fly.order}</h3>
			<TeamScoreCard
				rankedTeams={scoreCard.rankedTeams}
				targets={scoreCard.targets}
				players={scoreCard.players}
				settings={scoreCard.regulation}
			/>
		{:else}
			<h3>Fly #{scoreCard.fly.order}</h3>
			<PlayerScoreCard rankedPlayers={scoreCard.rankedPlayers} targets={scoreCard.targets} />
		{/if}
	{/each}
</div>

<style>
	h3 {
		margin-bottom: 0;
		padding-bottom: 0;
	}
</style>
