<script lang="ts">
	import type { Competition } from '$lib/types/competitionType';
	import type { Course } from '$lib/types/courseType';
	import type { Target } from '$lib/types/targetType';
	import type { Player } from '$lib/types/playerType';
	import type { Team } from '$lib/types/teamType';
	import type { Regulations, Regulation } from '$lib/types/regulationsType';
	import { formatList } from '$lib/utils/sharedFunction';

	import { getRankedTeams } from '$lib/utils/session/golfScoringFunction.svelte';
	import { coursesChampionshipStore } from '$lib/stores/championship/coursesChampionshipStore.svelte';
	import { playersChampionshipStore } from '$lib/stores/championship/playersChampionshipStore.svelte';
	import { teamsCompetitionStore } from '$lib/stores/championship/teamsCompetitionStore.svelte';
	import { targetsChampionshipStore } from '$lib/stores/championship/targetsChampionshipStore.svelte';
	import { resultsCompetitionStore } from '$lib/stores/championship/resultsCompetitionStore.svelte';
	import { resultService } from '$lib/utils/pocketbase/Result2Cloud';
	import TeamScoreCardByTarget from '$lib/ui/TeamScoreCardByTarget.svelte';
	import { networkStatus } from '$lib/stores/networkStore.svelte';

	import { onMount } from 'svelte';
	import { getRules } from '$lib/utils/championship/competitionsFunctions.svelte';
	import { playerService } from '$lib/utils/pocketbase/players2Cloud';

	let { currentCompetition = $bindable() } = $props<{
		currentCompetition: Competition | undefined;
	}>();
	let course: Course | undefined = $derived(
		coursesChampionshipStore.find(currentCompetition.courseId)
	);
	let teams: Team[] | undefined = $derived(
		teamsCompetitionStore.list.filter((t) => currentCompetition.teamsId.includes(t.id))
	);
	let players: Player[] | undefined = $derived(
		playersChampionshipStore.list.filter((p) =>
			teams
				.map((t) => t.playersId)
				.flat()
				.includes(p.id)
		)
	);
	let rules: Regulations = $state(getRules(currentCompetition));
	let settings: Regulation = $derived(rules.regulation);
	let targets: Target[] = $derived(course?.targets || []);
	let rankedTeams = $derived(getRankedTeams(teams, targets, players, settings));
	let isShowingPlayoff: boolean = $state(false);
	let playoffPlayers: Player[] = $state([]);
	let playoffTeams: Team[] | undefined = $state([]);
	let playoffTarget: Target = $state({} as Target);
	let isOnline: boolean = $state(true);

	$effect(() => {
		if (networkStatus.isOnline) isOnline = true;
		else isOnline = false;
	});

	const checkPlayoff = () => {
		// List tied first place competitors
		playoffTeams = rankedTeams
			.filter((team) => team.isTie && team.rank === 1)
			.map((team) => team.team);
		playoffTeams.forEach((team) => {
			team.playersId.map((playerId) => {
				const player = playersChampionshipStore.find(playerId);
				if (player) playoffPlayers.push(player);
			});
		});
	};

	const preparePlayoff = () => {
		// create playoff target
		playoffTarget = targetsChampionshipStore.add('playoff', 0, 'Bonus');
		if (course) course.targets.push(playoffTarget);
		// show interface for scoring playoffTarget
		isShowingPlayoff = true;
	};

	const resolveTies = (winner: Player) => {
		if (confirm(winner.name + ' a gagné le playoff ?')) {
			players.forEach((player) => {
				player.scores[playoffTarget.id] = player.id === winner.id ? -1 : 0;

				// Mettre à jour les résultats définitifs
				let result = resultsCompetitionStore.find(currentCompetition.id, player.id);
				if (result) result.scores = player.scores;
				else result = resultsCompetitionStore.add(currentCompetition.id, player.id, player.scores);

				// Sauver le résultat dans le Cloud si c'est possible
				if (isOnline) {
					playerService.savePlayer(player);
					resultService.saveResult(result);
				}

				// Supprimer l'affichage du playoff
				isShowingPlayoff = false;
			});
		}
	};

	onMount(() => {
		checkPlayoff();
	});
</script>

<div>
	{#if rankedTeams[0].isTie && !isShowingPlayoff && playoffTeams}
		<p>Nous avons une égalité entre {formatList(playoffTeams.map((t) => t.name))}</p>
		<button onclick={() => preparePlayoff()} class="btn btn-primary">Préparer le playoff</button>
		<p>Ajout d'un trou supplémentaire</p>
		<p>Score saisie, uniquement pour les équipes ou joueurs à départager</p>
	{/if}

	{#if isShowingPlayoff}
		<h3>Sélectionner le vainqueur du playoff</h3>
		{#each playoffPlayers as player}
			<p>{player.name} <button onclick={() => resolveTies(player)}>👑</button></p>
		{/each}
	{/if}

	<!-- Affichage de la carte de score -->
	<TeamScoreCardByTarget {rankedTeams} {targets} {players} {settings} />
</div>
