<script lang="ts">
	import type { Competition } from '$lib/types/competitionType';
	import { competitionsStore } from '$lib/stores/championship/competitionsStore.svelte';
	import { competitionService } from '$lib/utils/pocketbase/competitions2Cloud';
	import { cloudSaveCompetition } from '$lib/utils/championship/competitionsFunctions.svelte';

	import DatePicker from '$lib/ui/DatePicker.svelte';
	import Param from '$lib/ui/Param.svelte';
	import { toastStore } from '$lib/stores/toastStore.svelte';
	import { onMount } from 'svelte';
	import type { Championship } from '$lib/types/championshipType';

	let { currentCompetition = $bindable(), championship = $bindable() } = $props<{
		currentCompetition: Competition | undefined;
		championship: Championship;
	}>();

	let competitions = $derived<Competition[]>(
		competitionsStore.list.filter((c) => championship.competitionsId.includes(c.id))
	);
	let editCompetition: boolean[] = $state([]);
	let isEditingCompetition: boolean = $state(false);
	let numCompetitions: number = $derived(competitions.length);

	let allCloudCompetitions: Competition[] = $state([]);
	let loading = $state(true);
	let knownCompetitionsId: string[] = $derived(competitionsStore.list.map((c) => c.id));
	let filteredCompetitions: Competition[] = $derived(
		allCloudCompetitions.filter((c) => !knownCompetitionsId.includes(c.id))
	);

	let addNewCompetition: boolean = $state(false);

	let competitionName: string = $state('');
	let competitionDate: string = $state(new Date().toISOString().split('T')[0]);
	let publicationDate: string = $state(new Date().toISOString().split('T')[0]);
	let competitionLocation: string = $state('');

	const createCompetition = () => {
		let tmpCompetition: Competition = competitionsStore.add(
			competitionName,
			'setup',
			'welcome',
			competitionDate,
			publicationDate,
			competitionLocation
		);
		championship.competitionsId.push(tmpCompetition.id);

		competitionName = competitionLocation = '';
		competitionDate = publicationDate = new Date().toISOString().split('T')[0];
		addNewCompetition = false;
	};

	const removeCompetition = (id: string) => {
		if (confirm('Voulez-vous vraiment supprimer cette compétition ?')) {
			competitionsStore.remove(id);
		}
	};

	const editingCompetition = (index: number) => {
		for (let i = 0; i < numCompetitions; i++) {
			if (i !== index) editCompetition[i] = false;
		}
		editCompetition[index] = !editCompetition[index];

		isEditingCompetition = editCompetition.some((item) => item);
	};

	const savingCompetition = async (competition: Competition) => {
		let status = await cloudSaveCompetition(competition, championship.id);

		switch (status) {
			case 'success':
				toastStore.show('💾 Enregistrement effectué ...', 'success');
				break;
			case 'failure':
				toastStore.show("💾 Echec à l'enregistrement ...", 'failure');
				break;
			default:
				toastStore.show('💾 Enregsistrement en cours ...', 'failure');
		}
	};

	const loadCompetitionfromCloud = (index: number) => {
		const aCompet = competitionsStore.list.filter((c) => c.id === filteredCompetitions[index].id);
		if (aCompet.length == 0) {
			if (confirm('Voulez-vous importer la compétition ?')) {
				competitionsStore.load(filteredCompetitions[index]);
			}
		}
	};

	onMount(async () => {
		allCloudCompetitions = await competitionService.getCompetitionsByChampionship(championship.id);
		loading = false;
	});

	const loadingCompetition = (competition: Competition) => {
		currentCompetition = competition;
	};
</script>

<h2>Compétitions</h2>
{#if !addNewCompetition}
	<div class="competitions-list">
		{#each competitions as competition, i}
			<div class="competition-item">
				<div role="none" class="competition-card" onclick={() => loadingCompetition(competition)}>
					<div class="details">
						{competition.name}
					</div>
					<div>{competition.startDate}</div>
					<div class="icon">🏆</div>
				</div>
				<div class="action">
					<button onclick={() => removeCompetition(competition.id)}> 🗑️ </button>
					<button onclick={() => editingCompetition(i)}>✏️</button>
					<button onclick={() => savingCompetition(competition)}>☁️</button>
				</div>
			</div>
		{/each}
	</div>

	{#each competitions as competition, i}
		{#if editCompetition[i]}
			<div class="competition-form">
				<h3>Modifier la Compétition</h3>
				<Param
					label="⛳ Nom de la compétition"
					type="text"
					bind:value={competition.name}
					focus={true}
					placeholder="Nom de la compétition"
				/>
				<DatePicker label="📅 Date de la compétition" bind:value={competition.startDate} />
				<DatePicker
					label="📅 Publication des résultats"
					bind:value={competition.scorePublicationDate}
				/>
				<Param
					label="⛳ Localisation"
					type="text"
					bind:value={competition.location}
					placeholder="Localisation"
				/>
			</div>
		{/if}
	{/each}

	{#if competitions.length === 0}
		<p>Aucune compétition enregistrée pour le moment. 🏆</p>
	{/if}

	{#if !isEditingCompetition}
		<button onclick={() => (addNewCompetition = true)}>Ajouter une nouvelle compétition</button>
	{/if}
{:else}
	<div class="competition-form">
		<h3 style="margin-top: 0">Nouvelle Compétition</h3>
		<Param
			label="⛳ Nom de la compétition"
			type="text"
			bind:value={competitionName}
			focus={true}
			placeholder="Nom de la compétition"
		/>
		<DatePicker label="📅 Date de la compétition" bind:value={competitionDate} />
		<DatePicker label="📅 Publication des résultats" bind:value={publicationDate} />
		<Param
			label="⛳ Localisation"
			type="text"
			bind:value={competitionLocation}
			placeholder="Localisation"
		/>
		<div class="action">
			<button onclick={createCompetition}>Créer</button>
			<button onclick={() => (addNewCompetition = false)}>Annuler</button>
		</div>
	</div>
{/if}

<h3>Competitions disponibles sur le Cloud</h3>

{#if loading}
	<p>Chargement ...</p>
{:else}
	{#each filteredCompetitions as c, i}
		<button onclick={() => loadCompetitionfromCloud(i)}>
			<div>{c.name} - {c.startDate}</div>
		</button>
	{/each}
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
		border-color: var(--border-color);
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

	.competition-form {
		border: 1px var(--primary) solid;
		padding: 0.5rem;
		border-radius: 0.5rem;
	}
</style>
