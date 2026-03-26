<script lang="ts">
	import '$lib/styles/golfScoring.css';
	import type { Ranking } from '$lib/types/championshipType';

	import { onMount } from 'svelte';
	import { playersChampionshipStore } from '$lib/stores/championship/playersChampionshipStore.svelte';
	import { clubsStore } from '$lib/stores/championship/clubsStore.svelte';
	import { competitionsStore } from '$lib/stores/championship/competitionsStore.svelte';
	import { calculateChampionship } from '$lib/utils/championship/championshipFunctions.svelte';

	import { formatList } from '$lib/utils/sharedFunction';
	import { championshipStore } from '$lib/stores/championship/championshipsStore.svelte';
	import { selection } from '$lib/stores/selection';

	let championship = $state(championshipStore.list.find((c) => c.id === selection.currentId));

	onMount(() => {
		if (championship) calculateChampionship(championship);
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

<button
	onclick={() => alert("Pas développé. Va dans paramètre, 'Sauvegarde Serveur'")}
	class="btn btn-primary">Publier</button
>

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
		{#if championship}
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
		{/if}
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
		{#if championship}
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
		{/if}
	</tbody>
</table>
