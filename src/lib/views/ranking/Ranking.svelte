<script lang="ts">
	import type { Championship } from '$lib/types/championshipType';
	import type { Competition } from '$lib/types/competitionType';
	import { championshipService } from '$lib/utils/pocketbase/championships2Cloud';
	import { competitionService } from '$lib/utils/pocketbase/competitions2Cloud';
	import Selector from '$lib/ui/Selector.svelte';
	import RankingChampionship from '$lib/components/ranking/RankingChampionship.svelte';

	const championships = $state(championshipService.getAllChampionships());
	let aChampionship: Championship = $state({} as Championship);
	let showChampionshipRanking: boolean = $state(false);

	const competitions = $derived(competitionService.getCompetitionsByChampionship(aChampionship.id));
	let aCompetition: string = $state('');
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
					<option value={championship}>{championship.name}</option>
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
			<Selector
				id="competitionSelect"
				bind:value={aCompetition}
				label="Liste des compétitions"
				options={competitions.map((c) => c.id)}
				optionsLabel={competitions.map((c) => c.name)}
			/>
		{/await}

		{#if aCompetition}
			<button
				class="btn btn-primary"
				onclick={() => (showCompetitionRanking = !showCompetitionRanking)}
			>
				<div>Voir les résultats de la compétition</div>
			</button>

			{#if showCompetitionRanking}
				Classement de la compétition
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
