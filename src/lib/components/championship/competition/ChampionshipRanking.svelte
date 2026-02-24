<script lang="ts">
	import type { Competition } from '$lib/types/competitionType';
	import CompetitionMenu from './CompetitionMenu.svelte';
	import '$lib/styles/golfScoring.css';
	import type { Championship } from '$lib/types/championshipType';
	import type { Ranking } from '$lib/types/championshipType';
	import { onMount } from 'svelte';
	import { playersChampionshipStore } from '$lib/stores/championship/playersChampionshipStore.svelte';
	import { clubsStore } from '$lib/stores/championship/clubsStore.svelte';
	import { competitionsStore } from '$lib/stores/championship/competitionsStore.svelte';
	import { isCompetitionTeam } from '$lib/utils/championship/competitionsFunctions.svelte';
	import { resultsCompetitionStore } from '$lib/stores/championship/resultsCompetitionStore.svelte';
	import { mpsStore } from '$lib/stores/championship/markedPointScaleStore.svelte';
	import type { MarkedPointScale } from '$lib/types/markedPointScaleType';
	import { smartSort } from '$lib/utils/sharedFunction';
	import RankingCard from '$lib/components/RankingCard.svelte';
	import { teamsChampionshipStore } from '$lib/stores/championship/teamsChampionshipStore.svelte';

	let { currentCompetition = $bindable(), championship = $bindable() } = $props<{
		currentCompetition: Competition;
		championship: Championship;
	}>();

	const somme = (scores: Record<string, number>) => {
		return Object.values(scores).reduce((acc, score) => acc + score, 0);
	};

	onMount(() => {
		// Calcul du classment général par joueur
		let rankingIdv: Ranking[] = [];
		const idvScale: MarkedPointScale | undefined = mpsStore.getScaleById(
			championship.individualScale
		);
		championship.competitionsId.forEach((cId: string) => {
			const competition = competitionsStore.find(cId);
			if (competition && idvScale && !isCompetitionTeam(competition)) {
				let players = playersChampionshipStore.list.filter((p) =>
					competition.playersId.includes(p.id)
				);
				// Récupérer le score de chaque joueur lors de la compétition
				players.forEach((p) => {
					p.scores = resultsCompetitionStore.find(competition.id, p.id)?.scores ?? {};
				});
				players.sort((a, b) => somme(a.scores) - somme(b.scores));
				for (let i = 0; i < players.length - 1; i++) {
					let prevScore: number = 0;
					// Recherche du joueur dans rankingPlayers
					const pId = rankingIdv.findIndex((rp: Ranking) => rp.id === players[i].id);
					if (pId !== -1) {
						prevScore = championship.rankingPlayers[pId].score;
						rankingIdv.splice(pId, 1);
					}
					rankingIdv.push({
						id: players[i].id,
						score: idvScale.points[i] + prevScore
					});
				}
				// Trier le nouveau championship.rankingPlayers
				rankingIdv = smartSort(rankingIdv, 'score');
			}
		});
		championship.rankingPlayers = rankingIdv;

		// Calcul du classmenet général par équipe
		let rankingClv: Ranking[] = [];
		const clvScale: MarkedPointScale | undefined = mpsStore.getScaleById(
			championship.collectiveScale
		);
		championship.competitionsId.forEach((cId: string) => {
			const competition = competitionsStore.find(cId);
			// Todo
			// Prévoir le cas où competition individuelle mais calcul d'un classement par équipe
			if (competition && clvScale && isCompetitionTeam(competition)) {
				let teams = teamsChampionshipStore.list.filter((t) => competition.teamsId.includes(t.id));
			}
		});
		championship.rankingClubs = rankingClv;
	});
</script>

<CompetitionMenu bind:currentCompetition />
<p>Calcul du championnat</p>

<p>S'il s'agit d'une compétition par équipe ou solo avec calcul équipe</p>
<p>si second cas, calculer les équipes cf. fonction teamsForDoubleRanking()</p>
<p>Pour chaque équipe des clubs qualifiés</p>
<p>calculer le classement</p>
<p>Pour chaque équipe du classement</p>
<p>s'il n'existe pas dans le rankingClub</p>
<p>---- créer un club avec 0 points</p>
<p>ajouter les points de son rang suivant collectiveScale</p>

<p>Classement par joueur</p>
{#each championship.rankingPlayers as p}
	{@const player = playersChampionshipStore.find(p.id)}
	{#if player}
		<div>
			<span>{player.name}</span>
			<span>{p.score}</span>
		</div>
	{/if}
{/each}

<p>Classement par club</p>
{#each championship.rankingClubs as c}
	{@const club = clubsStore.find(c.id)}
	{#if club}
		<div>
			<span>{club.name}</span>
			<span>{c.score}</span>
		</div>
	{/if}
{/each}
