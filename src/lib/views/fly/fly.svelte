<script lang="ts">
	import type { Competition } from '$lib/types/competitionType';
	import type { Fly } from '$lib/types/flyType';
	import '$lib/styles/golfScoring.css';

	import CompetitionScoringEditSolo from '$lib/components/championship/competition/CompetitionScoringEditSolo.svelte';
	import CompetitionScoringEditTeams from '$lib/components/championship/competition/CompetitionScoringEditTeams.svelte';

	import { competitionsStore } from '$lib/stores/championship/competitionsStore.svelte';
	import { flysChampionshipStore } from '$lib/stores/championship/flysChampionshipStore.svelte';
	import { teamsChampionshipStore } from '$lib/stores/championship/teamsChampionshipStore.svelte';
	import { playersChampionshipStore } from '$lib/stores/championship/playersChampionshipStore.svelte';
	import { championshipStore } from '$lib/stores/championship/championshipsStore.svelte';
	import { messageStore } from '$lib/stores/appEventStore.svelte';

	import { onMount } from 'svelte';
	import { formatList } from '$lib/utils/sharedFunction';
	import {
		cloudLoadCurrentCompetitionForSupervisor,
		isCompetitionTeam
	} from '$lib/utils/championship/competitionsFunctions.svelte';
	import { user } from '$lib/utils/pocketbase/pocketBase';

	let championshipId: string = championshipStore.list[0].id;

	let currentCompetition: Competition | undefined = $state();
	let currentFly: Fly | undefined = $state();
	let flys: Fly[] = $state([]);

	const listCompetitors = (fly: Fly) => {
		let compList: string[] = [];
		if (currentCompetition) {
			if (isCompetitionTeam(currentCompetition)) {
				fly.teamsId.forEach((teamId) => {
					compList.push(teamsChampionshipStore.list.find((t) => t.id === teamId)?.name || '');
				});
			} else {
				fly.playersId.forEach((playerId) => {
					compList.push(playersChampionshipStore.list.find((t) => t.id === playerId)?.name || '');
				});
			}
		}
		return formatList(compList);
	};

	const loadCompetition = async () => {
		if ($user && confirm('Voulez-vous mettre à jour la compétition ?'))
			await cloudLoadCurrentCompetitionForSupervisor(championshipId, $user.id);
		selectFly();
		messageStore.reset();
		// Todo : proposer un fix pour la non mise à jour de currentCompétition
		// location.reload est une solution fonctionnelle mais ...
		location.reload();
	};

	const selectFly = () => {
		currentCompetition = competitionsStore.list.find(
			(competition) => competition.startDate === new Date().toISOString().split('T')[0]
		);

		if (currentCompetition && $user) {
			//liste les flys de la compétition
			let Allflys = flysChampionshipStore.list.filter((fly) =>
				currentCompetition?.flysId.includes(fly.id)
			);
			flys = Allflys.filter((fly) => fly.supervisorId === $user.id);
		}

		if (flys.length === 1) currentFly = flys[0];
	};

	onMount(() => {
		selectFly();
	});
</script>

<!-- Suivi d'une compétition -->
{#if currentCompetition}
	{#if flys.length === 0}
		<p>Aucun fly n'est à surveiller ...</p>
		<button onclick={() => loadCompetition()}>Récupérer des flys</button>
	{:else if currentFly}
		{#if isCompetitionTeam(currentCompetition)}
			<CompetitionScoringEditTeams bind:currentCompetition bind:currentFly />
		{:else}
			<CompetitionScoringEditSolo bind:currentCompetition bind:currentFly />
		{/if}
	{:else}
		<p>Liste des flys pour sélection</p>
		<div class="fly-list">
			{#each flys as fly, i}
				<div class="fly-item">
					<div role="none" class="fly-card" onclick={() => (currentFly = fly)}>
						<span style="font-size: larger">Fly #{fly.order} </span>
						<span style="font-size: smaller">{listCompetitors(fly)}</span>
						<span style="font-size: smaller">{fly.status || 'inconnu'}</span>
					</div>
				</div>
			{/each}
		</div>
	{/if}
{:else}
	<p>Aucune compétition n'est accessible ...</p>
	<button onclick={() => loadCompetition()}>Récupérer la compétition</button>
{/if}

<style>
	.fly-list {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		margin: 0rem;
	}

	.fly-item {
		display: flex;
		flex-direction: column;
		width: 95%;
		margin-bottom: 1rem;
	}

	.fly-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		background-color: var(--bg-card);
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		cursor: pointer;
		margin: 0 0.5rem 0 0;
		padding: 0.5rem 0;
	}

	.fly-card:hover {
		transform: translateY(-5px);
		border-color: var(--border-color);
	}
</style>
