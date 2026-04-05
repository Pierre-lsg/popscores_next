<script lang="ts">
	import '$lib/styles/golfScoring.css';
	import type { Ranking } from '$lib/types/championshipType';

	import { onMount } from 'svelte';
	import { playersChampionshipStore } from '$lib/stores/championship/playersChampionshipStore.svelte';
	import { clubsStore } from '$lib/stores/championship/clubsStore.svelte';
	import { competitionsStore } from '$lib/stores/championship/competitionsStore.svelte';
	import { calculateChampionship } from '$lib/utils/championship/championshipFunctions.svelte';

	import { formatList } from '$lib/utils/sharedFunction';
	import { championshipService } from '$lib/utils/pocketbase/championships2Cloud';
	import { championshipStore } from '$lib/stores/championship/championshipsStore.svelte';

	import { toastStore } from '$lib/stores/toastStore.svelte';
	import { messageStore } from '$lib/stores/appEventStore.svelte';
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

	const publishChampionship = async () => {
		try {
			if (championship) championshipService.save(championship);
			toastStore.show('💾 Résultats publiés ...', 'success');
			messageStore.remove('modifChamp');
		} catch (err) {
			toastStore.show('💾 Echec à la publication ...', 'failure');
		}
	};

	const linkToResults = async () => {
		if (championship) {
			try {
				const link = `${window.location.origin}/ranking/?cs=${championship.id}`;
				await navigator.clipboard.writeText(link);

				// On déclenche le toast !
				toastStore.show('🔗 Lien de partage copié !');
			} catch (err) {
				toastStore.show('❌ Erreur lors de la copie');
			}
		}
	};
</script>

<div class="action">
	<button onclick={() => publishChampionship()} class="btn btn-primary">Publier</button>
	<button onclick={() => linkToResults()} class="btn btn-primary">Récupérer le lien</button>
</div>

{#if championship && championship.rankingPlayers.length !== 0}
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
{:else}
	<p>Aucun classement par joueur actuellement</p>
{/if}

{#if championship && championship.rankingClubs.length !== 0}
	<h3>Classement par club</h3>
	<table>
		<thead>
			<tr>
				<th>Position</th>
				<th>Nom de l'asso</th>
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
{:else}
	<p>Aucun classement par club actuellement</p>
{/if}
