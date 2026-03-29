<script lang="ts">
	import type { Championship } from '$lib/types/championshipType';
	import type { Competition } from '$lib/types/competitionType';
	import { championshipService } from '$lib/utils/pocketbase/championships2Cloud';
	import { competitionService } from '$lib/utils/pocketbase/competitions2Cloud';
	import RankingChampionship from '$lib/components/ranking/RankingChampionship.svelte';
	import RankingCompetition from '$lib/components/ranking/RankingCompetition.svelte';

	const championships = $state(championshipService.getAllChampionships());
	let aChampionship: Championship = $state({} as Championship);
	let showChampionshipRanking: boolean = $state(false);

	const competitions = $derived(competitionService.getCompetitionsByChampionship(aChampionship.id));
	let aCompetition: Competition = $state({} as Competition);
	let showCompetitionRanking: boolean = $state(false);
</script>

<div>
	<h2>Résultats des championnats</h2>
	{#await championships}
		<p>Chargement des championnats</p>
	{:then championships}
		<div class="select-container">
			<label for="championshipSelect">Liste des championnats</label>

			<select id="championshipSelect" bind:value={aChampionship}>
				{#each championships as championship}
					{#if championship.status !== 'archived' && championship.status !== 'setup'}
						<option value={championship}>{championship.name}</option>
					{/if}
				{/each}
			</select>
		</div>
	{/await}

	{#if aChampionship.id}
		<button
			class="btn btn-primary"
			onclick={() => (showChampionshipRanking = !showChampionshipRanking)}
		>
			Voir les résultats du championnat
		</button>

		{#if showChampionshipRanking}
			<div>
				<RankingChampionship championship={aChampionship} />
			</div>
		{/if}
	{/if}

	{#if aChampionship.id}
		<hr />
		{#await competitions}
			<p>Chargement des compétitions</p>
		{:then competitions}
			<div class="select-container">
				<label for="competitionSelect">Liste des compétitions</label>

				<select id="competitionSelect" bind:value={aCompetition}>
					{#each competitions as competition}
						{#if competition.status === 'published'}
							<option value={competition}>{competition.name}</option>
						{/if}
					{/each}
				</select>
			</div>
		{/await}

		{#if aCompetition.id}
			<button
				class="btn btn-primary"
				onclick={() => (showCompetitionRanking = !showCompetitionRanking)}
			>
				<div>Voir les résultats de la compétition</div>
			</button>

			{#if showCompetitionRanking}
				<div>
					<RankingCompetition competition={aCompetition} />
				</div>
			{/if}
		{/if}
	{/if}
</div>

<style>
	.select-container {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: var(--bg-card);
		border-radius: 8px;
		margin-bottom: 0.5rem;
		padding: 0.5rem 0;
	}

	option {
		color: var(--text-main);
	}

	select {
		color: var(--text-main);
		flex: 1;
		min-width: 0;
	}

	label {
		width: 50%;
	}
</style>
