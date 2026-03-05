<script lang="ts">
	import '$lib/styles/golfScoring.css';
	import type { Championship } from '$lib/types/championshipType';
	import type { Ranking } from '$lib/types/championshipType';

	import { onMount } from 'svelte';
	import { playersChampionshipStore } from '$lib/stores/championship/playersChampionshipStore.svelte';
	import { clubsStore } from '$lib/stores/championship/clubsStore.svelte';
	import { competitionsStore } from '$lib/stores/championship/competitionsStore.svelte';
	import { calculateChampionship } from '$lib/utils/championship/championshipFunctions.svelte';

	import { formatList } from '$lib/utils/sharedFunction';

	let { championship = $bindable() } = $props<{
		championship: Championship;
	}>();

	onMount(() => {
		calculateChampionship(championship);
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

<h3>Classement par joueur</h3>
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

<h3>Classement par club ...</h3>
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
