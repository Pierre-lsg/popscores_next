<script lang="ts">
	import type { Competition } from '$lib/types/competitionType';
	import type { Player, RankedPlayer } from '$lib/types/playerType';
	import type { Target } from '$lib/types/targetType';
	import type { Course } from '$lib/types/courseType';
	import type { Team } from '$lib/types/teamType';
	import type { Regulations, Regulation } from '$lib/types/regulationsType';

	import { playersChampionshipStore } from '$lib/stores/championship/playersChampionshipStore.svelte';
	import { coursesChampionshipStore } from '$lib/stores/championship/coursesChampionshipStore.svelte';
	import { regulationsStore } from '$lib/stores/championship/regulationsStore.svelte';
	import { getRankedPlayers } from '$lib/utils/session/golfScoringFunction.svelte';

	import TeamScoreCardByTarget from '$lib/ui/TeamScoreCardByTarget.svelte';
	import PlayerScoreCardByTarget from '$lib/ui/PlayerScoreCardByTarget.svelte';

	import { onMount } from 'svelte';
	import { getRankedTeams } from '$lib/utils/session/golfScoringFunction.svelte';
	import {
		teamsForDoubleRanking,
		getRules
	} from '$lib/utils/championship/competitionsFunctions.svelte';

	let { currentCompetition = $bindable() } = $props<{
		currentCompetition: Competition | undefined;
	}>();
	let players: Player[] = $derived(
		playersChampionshipStore.list.filter((p) => currentCompetition.playersId.includes(p.id))
	);
	let rules: Regulations = $state(getRules(currentCompetition));
	let course: Course | undefined = $derived(
		coursesChampionshipStore.find(currentCompetition.courseId)
	);
	let targets: Target[] = $derived(course?.targets || []);
	let rankedPlayers: RankedPlayer[] = $derived(getRankedPlayers(players, targets || []));
	let teams: Team[] = $state([]);

	let settings: Regulation = $derived(rules.regulation);

	let rankedTeams = $derived(getRankedTeams(teams, targets, players, settings));

	let isShowingPlayers = $state(true);
	let isShowingTeams = $state(true);
	let playersDisp = $state('réduire');
	let teamsDisp = $state('réduire');

	const showPlayers = () => {
		isShowingPlayers = !isShowingPlayers;
		playersDisp = isShowingPlayers ? 'réduire' : 'développer';
	};

	const showTeams = () => {
		isShowingTeams = !isShowingTeams;
		teamsDisp = isShowingTeams ? 'réduire' : 'développer';
	};

	onMount(() => {
		if (rules.doubleRanking) teams = teamsForDoubleRanking(currentCompetition, targets, rules);
	});
</script>

<div>
	<!-- Affichage de la carte de score -->

	<div>
		Classement final (regroupement de l'ensemble des cartes de scores en individuel)
		<span role="none" onclick={() => showPlayers()} class="action">{playersDisp}</span>
	</div>

	{#if isShowingPlayers}
		<PlayerScoreCardByTarget {rankedPlayers} {targets} />
	{/if}

	<!-- Classement virtuel par équipe -->
	<p>si compétition demande un calcul par équipe</p>
	<p>Les deux meilleurs joueurs d'un club sont associés pour former une équipe</p>
	<p>un classement équipe est alors calculé</p>
	<!-- -->

	{#if rules && rules.doubleRanking}
		<div>
			Liste des équipes
			<span role="none" onclick={() => showTeams()} class="action">{teamsDisp}</span>
		</div>

		{#if isShowingTeams}
			<!-- Affichage du classement par équipe-->
			<TeamScoreCardByTarget {rankedTeams} {targets} {players} {settings} />
		{/if}
	{/if}
</div>

<style>
	.action {
		font-size: x-small;
	}
</style>
