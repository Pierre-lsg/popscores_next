<script lang="ts">
	import type { Competition } from '$lib/types/competitionType';
	import CompetitionMenu from './championship/competition/CompetitionMenu.svelte';
	import '$lib/styles/golfScoring.css';
	import type { Championship } from '$lib/types/championshipType';
	import type { Ranking } from '$lib/types/championshipType';
	import type { Player, RankedPlayer } from '$lib/types/playerType';
	import type { Course } from '$lib/types/courseType';
	import type { Target } from '$lib/types/targetType';
	import type { RankedTeam } from '$lib/types/teamType';

	import { onMount } from 'svelte';
	import { playersChampionshipStore } from '$lib/stores/championship/playersChampionshipStore.svelte';
	import { clubsStore } from '$lib/stores/championship/clubsStore.svelte';
	import { competitionsStore } from '$lib/stores/championship/competitionsStore.svelte';
	import { isCompetitionTeam } from '$lib/utils/championship/competitionsFunctions.svelte';
	import { resultsCompetitionStore } from '$lib/stores/championship/resultsCompetitionStore.svelte';
	import { mpsStore } from '$lib/stores/championship/markedPointScaleStore.svelte';
	import type { MarkedPointScale } from '$lib/types/markedPointScaleType';
	import { smartSort } from '$lib/utils/sharedFunction';
	import { teamsForDoubleRanking } from '$lib/utils/championship/competitionsFunctions.svelte';

	import { teamsChampionshipStore } from '$lib/stores/championship/teamsChampionshipStore.svelte';
	import { targetsChampionshipStore } from '$lib/stores/championship/targetsChampionshipStore.svelte';
	import { coursesChampionshipStore } from '$lib/stores/championship/coursesChampionshipStore.svelte';
	import { getRankedPlayers, getRankedTeams } from '$lib/utils/session/golfScoringFunction.svelte';
	import { regulationsStore } from '$lib/stores/championship/regulationsStore.svelte';
	import type { Regulations, Regulation } from '$lib/types/regulationsType';
	import { formatList } from '$lib/utils/sharedFunction';

	let { championship = $bindable() } = $props<{
		championship: Championship;
	}>();

	onMount(() => {
		let rankingClv: Ranking[] = [];
		let rankingIdv: Ranking[] = [];
		const idvScale: MarkedPointScale | undefined = mpsStore.getScaleById(
			championship.individualScale
		);
		const clvScale: MarkedPointScale | undefined = mpsStore.getScaleById(
			championship.collectiveScale
		);

		championship.competitionsId.forEach((cId: string) => {
			const competition = competitionsStore.find(cId);
			let course: Course | undefined;
			let targets: Target[] = [];
			let regulations: Regulations | undefined;
			let regulation: Regulation | undefined;
			if (competition && competition.courseId !== '')
				course = coursesChampionshipStore.find(competition.courseId);
			if (course) targets = course.targets;
			if (competition && competition.regulationsId)
				regulations = regulationsStore.find(competition.regulationsId);
			if (regulations) regulation = regulations.regulation;

			// Calcul pour le classement individuel
			if (competition && idvScale && regulation && !regulation.teamGame) {
				let players = playersChampionshipStore.list.filter((p) =>
					competition.playersId.includes(p.id)
				);
				let rankedPlayers: RankedPlayer[] = [];
				// Récupérer le score de chaque joueur lors de la compétition
				players.forEach((p) => {
					p.scores = resultsCompetitionStore.find(competition.id, p.id)?.scores ?? {};
				});
				if (targets && players) rankedPlayers = getRankedPlayers(players, targets);
				console.log(players, targets);

				for (let i = 0; i < rankedPlayers.length; i++) {
					let prevScore: number = 0;
					let prevCompetitions: string[] = [];
					// Recherche du joueur dans rankingPlayers
					// Todo : gérer les égalités ...
					const pId = rankingIdv.findIndex((rp: Ranking) => rp.id === rankedPlayers[i].player.id);
					if (pId !== -1) {
						prevScore = rankingIdv[pId].score;
						prevCompetitions = rankingIdv[pId].competitionsId;
						rankingIdv.splice(pId, 1);
					}
					rankingIdv.push({
						id: rankedPlayers[i].player.id,
						score: idvScale.points[i] + prevScore,
						competitionsId: [...prevCompetitions, competition.id]
					});
				}
			}

			// Calcul pour le classement des clubs si compétition en équipe
			if (competition && clvScale && isCompetitionTeam(competition)) {
				let teams = teamsChampionshipStore.list.filter((t) => competition.teamsId.includes(t.id));
				let players: Player[] | undefined = playersChampionshipStore.list.filter((p) =>
					teams
						.map((t) => t.playersId)
						.flat()
						.includes(p.id)
				);
				let rankedTeams: RankedTeam[] = [];
				let clubsRecord: Record<string, number> = {};

				if (targets && teams && players && regulation)
					rankedTeams = getRankedTeams(teams, targets, players, regulation);

				for (let i = 0; i < rankedTeams.length; i++) {
					if (!clubsRecord[rankedTeams[i].team.clubId]) clubsRecord[rankedTeams[i].team.clubId] = 1;
					else clubsRecord[rankedTeams[i].team.clubId]++;
					if (clubsRecord[rankedTeams[i].team.clubId] > championship.maxScoringTeams) continue;

					let prevScore: number = 0;
					let prevCompetitions: string[] = [];
					// Recherche du club dans rankingTeams
					const pId = rankingClv.findIndex((rp: Ranking) => rp.id === rankedTeams[i].team.clubId);
					if (pId !== -1) {
						prevScore = rankingClv[pId].score;
						prevCompetitions = rankingClv[pId].competitionsId;
						rankingClv.splice(pId, 1);
					}
					rankingClv.push({
						id: rankedTeams[i].team.clubId || '',
						score: clvScale.points[i] + prevScore,
						competitionsId: [...prevCompetitions, competition.id]
					});
				}
			}

			// Calcul pour le classement des clubs si compétition solo et calcul résultat équipe
			if (
				competition &&
				clvScale &&
				!isCompetitionTeam(competition) &&
				regulations?.doubleRanking
			) {
				let teams = teamsForDoubleRanking(competition, targets, regulations);
				let players: Player[] | undefined = playersChampionshipStore.list.filter((p) =>
					teams
						.map((t) => t.playersId)
						.flat()
						.includes(p.id)
				);
				let rankedTeams: RankedTeam[] = [];
				if (targets && teams && players && regulation)
					rankedTeams = getRankedTeams(teams, targets, players, regulation);
				for (let i = 0; i < rankedTeams.length; i++) {
					let prevScore: number = 0;
					let prevCompetitions: string[] = [];
					const pId = rankingClv.findIndex((rp: Ranking) => rp.id === rankedTeams[i].team.clubId);
					if (pId !== -1) {
						prevScore = rankingClv[pId].score;
						prevCompetitions = rankingClv[pId].competitionsId;
						rankingClv.splice(pId, 1);
					}
					rankingClv.push({
						id: rankedTeams[i].team.clubId || '',
						score: clvScale.points[i] + prevScore,
						competitionsId: [...prevCompetitions, competition.id]
					});
				}
			}
		});
		championship.rankingPlayers = smartSort(rankingIdv, 'score', false);
		championship.rankingClubs = smartSort(rankingClv, 'score', false);
	});

	const competitionsPlayerDetails = (playerRanking: Ranking) => {
		const competitionNames = playerRanking.competitionsId
			.map((competitionId) => {
				const competition = competitionsStore.list.find((c) => c.id === competitionId);
				return competition ? competition.name : 'Compétition inconnue';
			})
			.filter((name) => name !== 'Compétition inconnue');
		alert(competitionNames);
	};

	const competitionsClubDetails = (clubRanking: Ranking) => {
		const competitionNames = clubRanking.competitionsId
			.map((competitionId) => {
				const competition = competitionsStore.list.find((c) => c.id === competitionId);
				return competition ? competition.name : 'Compétition inconnue';
			})
			.filter((name) => name !== 'Compétition inconnue');
		alert(formatList(competitionNames));
	};
</script>

<h3><p>Classement par joueur</p></h3>
<table>
	<thead>
		<tr>
			<th>Position</th>
			<th>Nom du Joueur</th>
			<th>Score</th>
			<th>Détails</th>
		</tr>
	</thead>
	<tbody>
		{#each championship.rankingPlayers as p, i}
			{@const player = playersChampionshipStore.find(p.id)}
			{#if player}
				<tr>
					<td>#{i + 1}</td>
					<td>{player.name}</td>
					<td>{p.score}</td>
					<td><div role="none" onclick={() => competitionsPlayerDetails(p)}>...</div></td>
				</tr>
			{/if}
		{/each}
	</tbody>
</table>

<h3>Classement par club</h3>
<table>
	<thead>
		<tr>
			<th>Position</th>
			<th>Nom du Club</th>
			<th>Score</th>
			<th>Détails</th>
		</tr>
	</thead>
	<tbody>
		{#each championship.rankingClubs as c, i}
			{@const club = clubsStore.find(c.id)}
			{#if club}
				<tr>
					<td>#{i + 1}</td>
					<td>{club.name}</td>
					<td>{c.score}</td>
					<td><div role="none" onclick={() => competitionsClubDetails(c)}>...</div></td>
				</tr>
			{/if}
		{/each}
	</tbody>
</table>
