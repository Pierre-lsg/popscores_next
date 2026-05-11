<script lang="ts">
	import type { Competition } from '$lib/types/competitionType';
	import type { ScoreCard } from '$lib/types/scoreCardType';
	import type { Fly } from '$lib/types/flyType';
	import type { Result } from '$lib/types/resultType';

	import CompetitionMenu from './CompetitionMenu.svelte';
	import { onMount } from 'svelte';
	import { isCompetitionTeam } from '$lib/utils/championship/competitionsFunctions.svelte';
	import TeamScoreCard from '$lib/components/core_game/TeamScoreCard.svelte';
	import PlayerScoreCard from '$lib/components/core_game/PlayerScoreCard.svelte';
	import { coursesChampionshipStore } from '$lib/stores/championship/coursesChampionshipStore.svelte';
	import { flyService } from '$lib/utils/pocketbase/flys2Cloud';
	import { scoreCardService } from '$lib/utils/pocketbase/scoreCards2Cloud';
	import { resultService } from '$lib/utils/pocketbase/results2Cloud';
	import { teamsCompetitionStore } from '$lib/stores/championship/teamsCompetitionStore.svelte';
	import TeamScoreCardByTarget from '$lib/components/core_game/TeamScoreCardByTarget.svelte';
	import PlayerScoreCardByTarget from '$lib/components/core_game/PlayerScoreCardByTarget.svelte';

	let { currentCompetition = $bindable() } = $props<{
		currentCompetition: Competition | undefined;
	}>();

	let scoreCards: ScoreCard[] = $state([]);
	let flys: Fly[] = $state([]);
	let results: Result[] = $state([]);
	let flysProgress: Record<number, number> = $state({});

	const nbTotalTarget = $derived(
		coursesChampionshipStore.find(currentCompetition.courseId)?.targets.length || 100
	);

	onMount(async () => {
		scoreCards = await scoreCardService.getScoreCardByCompetition(currentCompetition.id);
		flys = await flyService.getFlysByCompetition(currentCompetition.id);
		results = await resultService.getResultsByCompetition(currentCompetition.id);

		// Calcul de l'avancement de chaque fly
		flys
			.filter((f) => f.status === 'in_progress')
			.forEach((aFly) => {
				const isTeamCompetition = isCompetitionTeam(currentCompetition);
				let playerId: string | undefined;

				if (isTeamCompetition) {
					const team = teamsCompetitionStore.find(aFly.teamsId[0]);
					playerId = team?.playersId[0];
				} else playerId = aFly.playersId[0];

				const result = results.find((r) => r.playerId === playerId);
				const scoreCount = result?.scores ? Object.keys(result.scores).length : 0;

				flysProgress[aFly.order] = scoreCount;
			});
	});
</script>

<CompetitionMenu bind:currentCompetition />

<div>
	<h2>Suivre les résultats en temps réel</h2>
	<h3>Flys en cours ou non commencés</h3>

	<div class="item-list-oneline">
		{#each flys as fly}
			{#if fly.status === 'in_progress' || fly.status === 'not_started'}
				<div class="item-details">
					<h4>Fly #{fly.order} - {fly.status === 'in_progress' ? 'en cours' : 'non commencé'}</h4>
					{#if fly.status === 'in_progress'}
						<div class="progress-bar">
							<div
								class="fill"
								style="width: {Math.round((flysProgress[fly.order] / nbTotalTarget) * 100)}%"
							></div>
						</div>
					{/if}
				</div>
			{/if}
		{/each}
	</div>

	<hr />
	<h3>Flys terminés</h3>
	{#each scoreCards as scoreCard}
		{#if isCompetitionTeam(currentCompetition)}
			<h4>Fly #{scoreCard.fly.order}</h4>
			<TeamScoreCardByTarget
				rankedTeams={scoreCard.rankedTeams}
				targets={scoreCard.targets}
				players={scoreCard.players}
				settings={scoreCard.regulation}
			/>
		{:else}
			<h4>Fly #{scoreCard.fly.order}</h4>
			<PlayerScoreCardByTarget
				rankedPlayers={scoreCard.rankedPlayers}
				targets={scoreCard.targets}
			/>
		{/if}
	{/each}
</div>
