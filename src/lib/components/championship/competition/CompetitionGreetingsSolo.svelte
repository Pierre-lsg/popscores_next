<script lang="ts">
	import type { Competition } from '$lib/types/competitionType';
	import type { Player, RankedPlayer } from '$lib/types/playerType';
	import type { Target } from '$lib/types/targetType';
	import type { Course } from '$lib/types/courseType';
	import type { Team } from '$lib/types/teamType';

	import { playersChampionshipStore } from '$lib/stores/championship/playersChampionshipStore.svelte';
	import { coursesChampionshipStore } from '$lib/stores/championship/coursesChampionshipStore.svelte';
	import { regulationsStore } from '$lib/stores/championship/regulationsStore.svelte';
	import { getRankedPlayers } from '$lib/utils/session/golfScoringFunction.svelte';
	import TeamScoreCardByTarget from '$lib/ui/TeamScoreCardByTarget.svelte';
	import PlayerScoreCardByTarget from '$lib/ui/PlayerScoreCardByTarget.svelte';
	import type { Regulations, Regulation } from '$lib/types/regulationsType';
	import { onMount } from 'svelte';
	import { calculatePlayerScore } from '$lib/utils/session/golfScoringFunction.svelte';
	import { clubsStore } from '$lib/stores/championship/clubsStore.svelte';
	import { getRankedTeams } from '$lib/utils/session/golfScoringFunction.svelte';

	let { currentCompetition = $bindable() } = $props<{
		currentCompetition: Competition | undefined;
	}>();
	let players: Player[] = $derived(
		playersChampionshipStore.list.filter((p) => currentCompetition.playersId.includes(p.id))
	);
	let rules: Regulations | undefined = $state();
	let course: Course | undefined = $derived(
		coursesChampionshipStore.find(currentCompetition.courseId)
	);
	let targets: Target[] = $derived(course?.targets || []);
	let rankedPlayers: RankedPlayer[] = $derived(getRankedPlayers(players, targets || []));
	let teams: Team[] = $state([]);

	let settings: Regulation = {
		hasCrossAFixedPenalty: true,
		malusOverPar: 4,
		malusValue: 10,
		teamGame: true,
		playersPerTeam: 2,
		usePenalizingGhost: false
	};

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
		if (currentCompetition) {
			if (currentCompetition.regulationsId !== '')
				rules = regulationsStore.find(currentCompetition.regulationsId);
			if (!rules) {
				rules = regulationsStore.new();
				currentCompetition.regulationsId = rules.id;
			}
		}

		if (currentCompetition && rules?.doubleRanking) {
			// Calcul d'une équipe pour les clubs à partir des 2 joueurs de la compétition individuelle
			// Pour chaque club de la compétition
			console.log('Calcul du classment par équipe');
			//debug
			/*
			currentCompetition.clubsId = [
				'ac0d9308-a98e-4e0d-8d6a-81eaaeb55ed9',
				'4911e424-3009-4a2b-92aa-98a831de46f3',
				'6f4239db-3731-4857-854f-4e52fa10711c'
			];*/
			for (const clubId of currentCompetition.clubsId) {
				console.log('listing des clubs');
				let clubName: string = '';
				if (clubId && clubId != '') {
					clubName = clubsStore.find(clubId)?.name || 'vide';
					// Retrouver l'ensemble des joueurs de ce club qui ont participé à la compétition
					let playersClubCompetition = playersChampionshipStore.list
						.filter((p) => p.clubId === clubId)
						.filter((p) => currentCompetition.playersId.includes(p.id));
					// Trier cette liste par résultat à la compétition
					playersClubCompetition.sort((a, b) => {
						return calculatePlayerScore(a, targets) - calculatePlayerScore(b, targets);
					});
					// Si plus d'un joueur pour la compétition
					if (playersClubCompetition.length > 1) {
						// Créer une équipe avec
						let team: Team = { id: '', name: '', playersId: [] };
						team.name = clubName;
						team.playersId.push(playersClubCompetition[0].id);
						team.playersId.push(playersClubCompetition[1].id);
						team.clubId = clubId;
						console.log('équipe créée : ', team);
						teams.push(team);
					}
				}
			}
			console.log('Teams', teams);
		}
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
