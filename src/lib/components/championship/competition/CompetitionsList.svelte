<script lang="ts">
	import { confirmStore } from '$lib/stores/confirmStore.svelte';
	import type { Competition } from '$lib/types/competitionType';
	import type { User } from '$lib/types/userType';
	import { competitionsStore } from '$lib/stores/championship/competitionsStore.svelte';
	import { competitionService } from '$lib/utils/pocketbase/competitions2Cloud';
	import { championshipService } from '$lib/utils/pocketbase/championships2Cloud';
	import {
		cloudLoadCompetition,
		cloudSaveAllCompetition
	} from '$lib/utils/championship/competitionsFunctions.svelte';

	import DatePicker from '$lib/ui/DatePicker.svelte';
	import MultiSelector from '$lib/ui/MultiSelector.svelte';
	import Param from '$lib/ui/Param.svelte';

	import { userStore } from '$lib/stores/userStore.svelte';
	import { getCpMgrs } from '$lib/utils/championship/championshipFunctions.svelte';
	import { toastStore } from '$lib/stores/toastStore.svelte';
	import { smartSort } from '$lib/utils/sharedFunction';
	import { onMount } from 'svelte';
	import type { Championship } from '$lib/types/championshipType';

	let { currentCompetition = $bindable(), championship = $bindable() } = $props<{
		currentCompetition: Competition | undefined;
		championship: Championship;
	}>();
	let cpMgrs: Promise<User[]> = $state(getCpMgrs(championship));

	let competitions = $derived<Competition[]>(
		smartSort(
			competitionsStore.list.filter((c: Competition) => {
				if (userStore.current) {
					if (userStore.current?.roles.includes('admin') || userStore.current?.roles.includes('csMgr'))
						return championship.competitionsId.includes(c.id);
					if (userStore.current.id !== null)
						return championship.competitionsId.includes(c.id) && c.managersId.includes(userStore.current.id);
				}
				return false;
			}),
			'startDate'
		)
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

	const today = new Date().toISOString().split('T')[0];
	let competitionName: string = $state('');
	let competitionDate: string = $state(today);
	let publicationDate: string = $state(today);
	let competitionLocation: string = $state('');
	let competitionManagersId: string[] = $state([]);

	const createCompetition = async () => {
		let tmpCompetition: Competition = competitionsStore.add(
			competitionName,
			'setup',
			'welcome',
			competitionDate,
			publicationDate,
			competitionLocation,
			competitionManagersId
		);
		championship.competitionsId.push(tmpCompetition.id);
		await championshipService.save(championship);

		competitionName = competitionLocation = '';
		competitionDate = publicationDate = today;
		addNewCompetition = false;
	};

	const removeCompetition = async (aCompetition: Competition) => {
		if (await confirmStore.prompt('Voulez-vous vraiment supprimer cette compétition ?')) {
			championship.competitionsId = championship.competitionsId.filter(
				(id: string) => id !== aCompetition.id
			);
			competitionsStore.remove(aCompetition.id);
			await championshipService.save(championship);
		}
	};

	const editingCompetition = async (index: number) => {
		for (let i = 0; i < numCompetitions; i++) {
			if (i !== index) editCompetition[i] = false;
		}
		editCompetition[index] = !editCompetition[index];

		isEditingCompetition = editCompetition.some((item) => item);
	};

	const savingCompetition = async (competition: Competition) => {
		if (
			await confirmStore.prompt(
				'Voulez-vous mettre à jour les informations partagées de la compétition ? \n Action déconseillée si la compétition est en cours'
			)
		) {
			let status = await cloudSaveAllCompetition(competition, championship.id);

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
		}
	};

	const loadCompetitionfromCloud = async (index: number) => {
		const aCompet = competitionsStore.list.filter((c) => c.id === filteredCompetitions[index].id);
		if (aCompet.length == 0) {
			if (await confirmStore.prompt('Voulez-vous importer la compétition ?')) {
				cloudLoadCompetition(filteredCompetitions[index].id);
			}
		}
	};

	onMount(async () => {
		allCloudCompetitions = await competitionService.getCompetitionsByChampionship(championship.id);
		loading = false;
	});

	const loadingCompetition = async (competition: Competition) => {
		currentCompetition = competition;
	};

	const toggleManagers = async () => {
		// Pour chaque compétition du championnat, renvoie la liste des managersId
		const managers = championship.competitionsId
			.map((competitionId: string) => {
				const competition = competitionsStore.list.find((c) => c.id === competitionId);
				return competition ? competition.managersId : [];
			})
			.flat();
		const uniqueManagers = [...new Set(managers)];

		// uniqueManagers est maintenant un tableau sans doublons
		championship.cpManagersId = uniqueManagers;
	};
</script>

<h2>Compétitions</h2>
{#if !addNewCompetition}
	{#if !isEditingCompetition}
		<div class="item-list">
			{#each competitions as competition, i}
				<div class="item-details">
					<div role="none" class="item-card" onclick={async () => loadingCompetition(competition)}>
						<div class="details">
							{competition.name}
						</div>
						<div>{competition.startDate.split('-').reverse().join('/')}</div>
						<div class="icon">⛳</div>
					</div>
					{#if (competition.status !== 'finished' && competition.status !== 'published') || competition.startDate >= today}
						<div class="action">
							<button onclick={async () => removeCompetition(competition)}> 🗑️ </button>
							<button onclick={async () => editingCompetition(i)}>✏️</button>
							<button onclick={async () => savingCompetition(competition)}>☁️</button>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	{/if}

	{#each competitions as competition, i}
		{#if editCompetition[i]}
			<div class="item-form">
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
				{#await cpMgrs then cpMgrs}
					<MultiSelector
						id="managerSelect"
						bind:value={competition.managersId}
						label="Sélection de responsables"
						options={cpMgrs.map((c) => c.id)}
						optionsLabel={cpMgrs.map((c) => c.name)}
						onchange={() => toggleManagers()}
					/>
				{/await}
				<button onclick={async () => editingCompetition(i)} class="btn btn-primary">Terminer</button>
			</div>
		{/if}
	{/each}

	{#if competitions.length === 0}
		<p>Aucune compétition enregistrée pour le moment. 🏆</p>
	{/if}
	{#if userStore.current && (userStore.current?.roles.includes('admin') || userStore.current?.roles.includes('csMgr'))}
		{#if !isEditingCompetition}
			<button onclick={async () => (addNewCompetition = true)} class="btn btn-primary"
				>Ajouter une nouvelle compétition</button
			>
		{/if}
	{/if}
{:else}
	<div class="item-form">
		<h3>Nouvelle Compétition</h3>
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
		{#await cpMgrs then cpMgrs}
			<MultiSelector
				id="managerSelect"
				bind:value={competitionManagersId}
				label="Sélection de responsables"
				options={cpMgrs.map((c) => c.id)}
				optionsLabel={cpMgrs.map((c) => c.name)}
				onchange={() => toggleManagers()}
			/>
		{/await}
		<div class="action">
			<button onclick={createCompetition} class="btn btn-primary">Créer</button>
			<button onclick={async () => (addNewCompetition = false)} class="btn">Annuler</button>
		</div>
	</div>
{/if}

{#if loading}
	<h3>Competitions disponibles sur le Cloud</h3>
	<p>Chargement ...</p>
{:else if filteredCompetitions.length > 0}
	<h3>Competitions disponibles sur le Cloud</h3>
	{#each filteredCompetitions as c, i}
		<button onclick={async () => loadCompetitionfromCloud(i)}>
			<div>{c.name} - {c.startDate}</div>
		</button>
	{/each}
{/if}

<style>
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
</style>
