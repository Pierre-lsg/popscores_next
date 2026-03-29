<script lang="ts">
	import '$lib/styles/golfScoring.css';
	import type { Competition } from '$lib/types/competitionType';
	import PlayerScoreCard from '$lib/ui/PlayerScoreCard.svelte';
	import TeamScoreCard from '$lib/ui/TeamScoreCard.svelte';
	import { scoreCardService } from '$lib/utils/pocketbase/scoreCards2Cloud';

	let { competition = null } = $props<{
		competition: Competition;
	}>();

	const scoreCards = $derived(scoreCardService.getScoreCardByCompetition(competition.id));
</script>

<div>
	{#await scoreCards}
		<p>Récupération des cartes de score</p>
	{:then scoreCards}
		{#each scoreCards as scoreCard}
			{#if scoreCard.regulation.teamGame}
				<TeamScoreCard
					rankedTeams={scoreCard.rankedTeams}
					targets={scoreCard.targets}
					players={scoreCard.players}
					settings={scoreCard.regulation}
				/>
			{:else}
				<PlayerScoreCard targets={scoreCard.targets} rankedPlayers={scoreCard.rankedPlayers} />
			{/if}
		{/each}
	{/await}
</div>
