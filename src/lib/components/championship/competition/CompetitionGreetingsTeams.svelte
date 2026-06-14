<script lang="ts">
	import { confirmStore } from '$lib/stores/confirmStore.svelte';
	import type { Competition } from '$lib/types/competitionType';
	import type { Championship } from '$lib/types/championshipType';
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
	import { resultService } from '$lib/utils/pocketbase/results2Cloud';
	import TeamScoreCardByTarget from '$lib/components/core_game/TeamScoreCardByTarget.svelte';
	import { networkStatus } from '$lib/stores/networkStore.svelte';
	import { toastStore } from '$lib/stores/toastStore.svelte';

	import { onMount } from 'svelte';
	import { getRules } from '$lib/utils/championship/competitionsFunctions.svelte';
	import { playerService } from '$lib/utils/pocketbase/players2Cloud';
	import { competitionService } from '$lib/utils/pocketbase/competitions2Cloud';

	let { currentCompetition = $bindable(), championship = $bindable() } = $props<{
		currentCompetition: Competition | undefined;
		championship: Championship;
	}>();
	let course: Course | undefined = $derived(
		coursesChampionshipStore.find(currentCompetition.courseId)
	);
	let teams: Team[] | undefined = $derived(
		teamsCompetitionStore.list.filter(
			(t) => currentCompetition.teamsId.includes(t.id) && t.sessionId === currentCompetition.id
		)
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

	const checkPlayoff = async () => {
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

	const preparePlayoff = async () => {
		// create playoff target
		playoffTarget = targetsChampionshipStore.add('playoff', 0, 'Bonus');
		if (course) course.targets.push(playoffTarget);
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

	onMount(() => {
		checkPlayoff();
	});
</script>

<div>
	{#if rankedTeams[0].isTie && !isShowingPlayoff && playoffTeams}
		<p>Nous avons une égalité entre {formatList(playoffTeams.map((t) => t.name))}</p>
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

	<!-- Affichage de la carte de score -->
	<TeamScoreCardByTarget {rankedTeams} {targets} {players} {settings} />

	{#if currentCompetition.status !== 'published'}
		<button onclick={async () => publish()} class="btn btn-primary">Publier les résultats</button>
	{:else}
		<button onclick={async () => linkToResults()} class="btn btn-primary">Lien vers les résultats</button>
	{/if}
</div>
