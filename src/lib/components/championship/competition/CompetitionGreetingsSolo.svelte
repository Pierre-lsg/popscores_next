<script lang="ts">
	import { confirmStore } from '$lib/stores/confirmStore.svelte';
	import type { Competition } from '$lib/types/competitionType';
	import type { Championship } from '$lib/types/championshipType';
	import type { Player, RankedPlayer } from '$lib/types/playerType';
	import type { Target } from '$lib/types/targetType';
	import type { Course } from '$lib/types/courseType';
	import type { Team } from '$lib/types/teamType';
	import type { Regulations, Regulation } from '$lib/types/regulationsType';

	import { playersChampionshipStore } from '$lib/stores/championship/playersChampionshipStore.svelte';
	import { coursesChampionshipStore } from '$lib/stores/championship/coursesChampionshipStore.svelte';
	import { resultsCompetitionStore } from '$lib/stores/championship/resultsCompetitionStore.svelte';
	import { resultService } from '$lib/utils/pocketbase/results2Cloud';
	import { getRankedPlayers } from '$lib/utils/session/golfScoringFunction.svelte';
	import { networkStatus } from '$lib/stores/networkStore.svelte';
	import { toastStore } from '$lib/stores/toastStore.svelte';

	import TeamScoreCardByTarget from '$lib/components/core_game/TeamScoreCardByTarget.svelte';
	import PlayerScoreCardByTarget from '$lib/components/core_game/PlayerScoreCardByTarget.svelte';

	import { onMount } from 'svelte';
	import { getRankedTeams } from '$lib/utils/session/golfScoringFunction.svelte';
	import {
		teamsForDoubleRanking,
		getRules
	} from '$lib/utils/championship/competitionsFunctions.svelte';
	import { targetsChampionshipStore } from '$lib/stores/championship/targetsChampionshipStore.svelte';
	import { playerService } from '$lib/utils/pocketbase/players2Cloud';
	import { competitionService } from '$lib/utils/pocketbase/competitions2Cloud';

	let { currentCompetition = $bindable(), championship = $bindable() } = $props<{
		currentCompetition: Competition | undefined;
		championship: Championship;
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

	let isShowingPlayers: boolean = $state(true);
	let isShowingTeams: boolean = $state(true);
	let playersDisp = $state('réduire');
	let teamsDisp = $state('réduire');
	let isShowingPlayoff: boolean = $state(false);
	let playoffPlayers: Player[] = $state([]);
	let playoffTarget: Target = $state({} as Target);
	let isOnline: boolean = $state(true);

	$effect(() => {
		if (networkStatus.isOnline) isOnline = true;
		else isOnline = false;
	});

	const showPlayers = async () => {
		isShowingPlayers = !isShowingPlayers;
		playersDisp = isShowingPlayers ? 'réduire' : 'développer';
	};

	const showTeams = async () => {
		isShowingTeams = !isShowingTeams;
		teamsDisp = isShowingTeams ? 'réduire' : 'développer';
	};

	onMount(() => {
		if (rules.doubleRanking) teams = teamsForDoubleRanking(currentCompetition, targets, rules);
	});

	const preparePlayoff = async () => {
		// create playoff target
		playoffTarget = targetsChampionshipStore.add('playoff', 0, 'Bonus');
		if (course) course.targets.push(playoffTarget);
		// List tied first place competitors
		playoffPlayers = rankedPlayers
			.filter((player) => player.isTie && player.rank === 1)
			.map((player) => player.player);
		// show interface for scoring playoffTarget
		isShowingPlayoff = true;
	};

	const resolveTies = async (winner: Player) => {
		if (await confirmStore.prompt(winner.name + ' a gagné le playoff ?')) {
			for (const player of players) {
				player.scores[playoffTarget.id] = player.id === winner.id ? -1 : 0;

				// Mettre à jour les résultats définitifs
				let result = resultsCompetitionStore.find(currentCompetition.id, player.id);
				if (result) result.scores = player.scores;
				else result = resultsCompetitionStore.add(currentCompetition.id, player.id, player.scores);

				// Sauver le résultat dans le Cloud si c'est possible
				if (isOnline) {
					await playerService.savePlayer(player);
					await resultService.saveResult(result);
				}

				// Supprimer l'affichage du playoff
				isShowingPlayoff = false;
			}
		}
	};

	const publish = async () => {
		currentCompetition.status = 'published';
		await competitionService.saveCompetition(currentCompetition, championship.id);
	};

	const linkToResults = async () => {
		try {
			// todo: supprimer ce hotfix en récupérant dans la conf vite le bon chemin
			const link = `${window.location.origin}/popscores/ranking/?cs=${championship.id}&c=${currentCompetition.id}`;
			await navigator.clipboard.writeText(link);

			// On déclenche le toast !
			toastStore.show('🔗 Lien de partage copié !');
		} catch (err) {
			toastStore.show('❌ Erreur lors de la copie');
		}
	};
</script>

<div>
	<!-- Affichage de la carte de score -->

	<div>
		Classement final (regroupement de l'ensemble des cartes de scores en individuel)
		<span role="none" onclick={async () => showPlayers()} class="action">{playersDisp}</span>
	</div>

	{#if rankedPlayers[0].isTie && !isShowingPlayoff}
		<button onclick={async () => preparePlayoff()} class="btn btn-primary">Préparer le playoff</button>
		<p>Ajout d'un trou supplémentaire</p>
		<p>Score saisie, uniquement pour les équipes ou joueurs à départager</p>
	{/if}

	{#if isShowingPlayoff}
		<h3>Sélectionner le vainqueur du playoff</h3>
		{#each playoffPlayers as player}
			<p>{player.name} <button onclick={async () => resolveTies(player)}>👑</button></p>
		{/each}
	{/if}

	{#if isShowingPlayers}
		<PlayerScoreCardByTarget {rankedPlayers} {targets} />
	{/if}

	<!-- Classement virtuel par équipe
	<p>si compétition demande un calcul par équipe</p>
	<p>Les deux meilleurs joueurs d'un club sont associés pour former une équipe</p>
	<p>un classement équipe est alors calculé</p>
	-->

	{#if rules && rules.doubleRanking}
		<div>
			Liste des équipes
			<span role="none" onclick={async () => showTeams()} class="action">{teamsDisp}</span>
		</div>

		{#if isShowingTeams}
			<!-- Affichage du classement par équipe-->
			<TeamScoreCardByTarget {rankedTeams} {targets} {players} {settings} />
		{/if}
	{/if}

	{#if currentCompetition.status !== 'published'}
		<button onclick={async () => publish()} class="btn btn-primary">Publier les résultats</button>
	{:else}
		<button onclick={async () => linkToResults()} class="btn btn-primary">Lien vers les résultats</button>
	{/if}
</div>

<style>
	.action {
		font-size: x-small;
	}
</style>
