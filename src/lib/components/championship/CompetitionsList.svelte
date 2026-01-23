<script lang="ts">
	import { onMount } from 'svelte';
	import type { Competition } from '$lib/types/competitionType';
	import { competitionsStore } from '$lib/stores/championship/competitionsStore.svelte';
	import DatePicker from '$lib/ui/DatePicker.svelte';
	import Param from '$lib/ui/Param.svelte';

	let competitions = $state<Competition[]>(competitionsStore.list);
	let editCompetition: boolean[] = $state([]);
	let numCompetitions: number = $derived(competitions.length);

	let addNewCompetition: boolean = $state(false);

	let competitionName: string = $state('Compétition');
	let competitionDate: string = $state(new Date().toISOString().split('T')[0]);
	let publicationDate: string = $state(new Date().toISOString().split('T')[0]);
	let competitionLocation: string = $state('Localisation');

	let { currentCompetition = $bindable('') } = $props<{
		currentCompetition: string;
	}>();

	onMount(() => {
		//
		// Simuler le chargement des compétitions (à remplacer par une vraie source de données)
	});

	function createCompetition() {
		competitionsStore.add(competitionName, competitionDate, publicationDate, competitionLocation);
		addNewCompetition = false;
	}

	function removeCompetition(id: string) {
		if (confirm('Voulez-vous vraiment supprimer cette compétition ?')) {
			competitionsStore.remove(id);
		}
		competitions = competitionsStore.list;
	}

	function editingCompetition(index: number) {
		for (let i = 0; i < numCompetitions; i++) {
			if (i !== index) editCompetition[i] = false;
		}
		editCompetition[index] = !editCompetition[index];
	}
</script>

<h2>Compétitions</h2>

<div class="competitions-list">
	{#each competitions as competition, i}
		<div class="competition-item">
			<div
				role="none"
				class="competition-card"
				onclick={() => (currentCompetition = competition.id)}
			>
				<div class="details">
					{competition.name}
				</div>
				<div>{competition.startDate}</div>
				<div class="icon">🏆</div>
			</div>
			<div class="action">
				<button onclick={() => removeCompetition(competition.id)}> 🗑️ </button>
				<button onclick={() => editingCompetition(i)}>✏️</button>
			</div>
		</div>
	{/each}
</div>

{#each competitions as competition, i}
	{#if editCompetition[i]}
		<div class="competition-form">
			<h3>Modifier la Compétition</h3>
			<Param label="⛳ Nom de la compétition" type="text" bind:value={competition.name} />
			<DatePicker label="📅 Date de la compétition" bind:value={competition.startDate} />
			<DatePicker
				label="📅 Publication des résultats"
				bind:value={competition.scorePublicationDate}
			/>
			<Param label="⛳ Localisation" type="text" bind:value={competition.location} />
		</div>
	{/if}
{/each}

{#if competitions.length === 0}
	<p>Aucune compétition enregistrée pour le moment. 🏆</p>
{/if}

<button onclick={() => (addNewCompetition = true)}>Ajouter une nouvelle compétition</button>

{#if addNewCompetition}
	<div class="competition-form">
		<h3>Nouvelle Compétition</h3>
		<Param label="⛳ Nom de la compétition" type="text" bind:value={competitionName} />
		<DatePicker label="📅 Date de la compétition" bind:value={competitionDate} />
		<DatePicker label="📅 Publication des résultats" bind:value={publicationDate} />
		<Param label="⛳ Localisation" type="text" bind:value={competitionLocation} />
		<button onclick={createCompetition}>Créer</button>
		<button onclick={() => (addNewCompetition = false)}>Annuler</button>
	</div>
{/if}

<style>
	.competitions-list {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		margin: 0rem;
	}

	.competition-item {
		display: flex;
		flex-direction: column;
		width: 95%;
		margin-bottom: 1rem;
	}

	.competition-card {
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
	}

	.competition-card:hover {
		transform: translateY(-5px);
		border-color: var(--primary);
	}

	.details {
		align-items: center;
		margin: 0.5rem;
		gap: 8px;
	}

	.icon {
		margin: 0.5rem;
		font-size: 24px;
		color: #2c3e50;
	}

	.action {
		display: flex;
		flex-direction: row;
		justify-content: center;
		width: 100%;
		gap: 2rem;
		margin-top: 0.5rem;
	}
</style>
