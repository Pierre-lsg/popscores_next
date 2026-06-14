<script lang="ts">
	import { confirmStore } from '$lib/stores/confirmStore.svelte';
	import { onMount } from 'svelte';
	import type { Club } from '$lib/types/clubType';
	import ClubDisplayBox from './ClubDisplayBox.svelte';
	import { clubsStore } from '$lib/stores/championship/clubsStore.svelte';
	import { clubService } from '$lib/utils/pocketbase/clubs2Cloud';
	import { cloudLoadClubs, cloudSaveClubs } from '$lib/utils/championship/clubsFunctions.svelete';

	import Param from '$lib/ui/Param.svelte';
	import Toggle from '$lib/ui/Toggle.svelte';

	import { toastStore } from '$lib/stores/toastStore.svelte';
	import type { Championship } from '$lib/types/championshipType';

	let clubs = $derived(clubsStore.list.filter((c) => c.championshipId === championship.id));
	let clubDisplayed: Club = $state({} as Club);
	let editClub: boolean[] = $state([]);
	let addNewClub: boolean = $state(false);
	let isEditingClub: boolean = $state(false);

	let clubName: string = $state('');
	let clubDescription: string = $state('');
	let isFederationMember: boolean = $state(false);
	let showBox: boolean = $state(false);

	let allClubs: Club[] = $state([]);
	let loading = $state(true);
	let knownClubsId: string[] = $derived(clubs.map((c) => c.id));
	let filteredClubs: Club[] = $derived(allClubs.filter((c) => !knownClubsId.includes(c.id)));

	let { currentClub = $bindable(''), championship } = $props<{
		currentClub: string;
		championship: Championship;
	}>();

	const createClub = async () => {
		clubsStore.add(clubName, clubDescription, championship.id, [], [], isFederationMember);
		clubName = '';
		clubDescription = '';
		isFederationMember = false;
		addNewClub = false;
	};

	const removeClub = async (id: string) => {
		if (await confirmStore.prompt('Voulez-vous vraiment supprimer cette association ?')) {
			clubsStore.remove(id);
		}
	};

	const editingClub = async (index: number) => {
		for (let i = 0; i < clubs.length; i++) {
			if (i !== index) editClub[i] = false;
		}
		editClub[index] = !editClub[index];
		isEditingClub = editClub.some((value) => value === true);
	};

	const quickViewTeams = async (club: Club) => {
		clubDisplayed = club;
		showBox = true;
	};

	const savingClub = async (club: Club) => {
		let cloudClubs: Club[] = [];
		cloudClubs[0] = club;

		let status = await cloudSaveClubs(cloudClubs);

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

	const loadClubfromCloud = async (index: number) => {
		// If club doesn't exist
		const aClub = clubsStore.list.filter((c) => c.id === filteredClubs[index].id);
		if (aClub.length == 0) {
			if (await confirmStore.prompt("Voulez-vous importer l'association ?")) {
				const newClub = {
					id: filteredClubs[index].id,
					name: filteredClubs[index].name,
					description: filteredClubs[index].description,
					playersId: filteredClubs[index].playersId,
					teamsId: filteredClubs[index].teamsId,
					isMember: filteredClubs[index].isMember,
					championshipId: filteredClubs[index].championshipId
				};
				// Load session to the local Store
				cloudLoadClubs([newClub]);
			}
		}
	};

	onMount(async () => {
		// Check if 'sans club' is available
		if (
			!clubsStore.list.find((c) => c.name === 'hors asso' && c.championshipId === championship.id)
		)
			// if not, create it
			clubsStore.add(
				'hors asso',
				'Liste des joueurs et équipes non affiliées à une association',
				championship.id
			);

		allClubs = await clubService.getAllClubsOfChampionship(championship.id);
		loading = false;
	});
</script>

<h2>Associations</h2>

{#if !isEditingClub && !addNewClub}
	<div class="item-list">
		{#each clubs as club, i (i)}
			<div class="item-details">
				<div role="none" class="item-card" onclick={async () => (currentClub = club.id)}>
					<div class="details">
						{club.name}
					</div>
					<div class="text-sm">{club.description.substring(0, 40) + ' ...'}</div>
					<div class="icon">🏆</div>
				</div>
				<div class="action">
					<button onclick={async () => removeClub(club.id)}> 🗑️ </button>
					<button onclick={async () => editingClub(i)}>✏️</button>
					<button onclick={async () => quickViewTeams(club)}>👁️</button>
					<button onclick={async () => savingClub(club)}>☁️</button>
				</div>
			</div>
		{/each}

		<!-- Sans club -->
		<!--
		<div class="item-details">
			<div role="none" class="item-card" onclick={async () => (currentClub = 'no_club')}>
				<div class="details">Sans club</div>
				<div class="text-sm">Equipes et joueurs sans non affiliés à un club</div>
				<div class="icon">❓</div>
			</div>
		</div>
		-->
	</div>

	{#if clubs.length === 0}
		<p>Aucune association enregistrée pour le moment. 🏆</p>
	{/if}

	<button onclick={async () => (addNewClub = true)} class="btn btn-primary"
		>Ajouter une nouvelle association</button
	>

	{#if loading}
		<h3>Associations disponibles sur le Cloud</h3>
		<p>Chargement ...</p>
	{:else}
		<h3>Associations disponibles sur le Cloud</h3>
		{#each filteredClubs as c, i (i)}
			<button onclick={async () => loadClubfromCloud(i)}>
				<div>{c.name} - {c.description?.slice(0, 30)}</div>
			</button>
		{/each}
	{/if}
{/if}

<!-- Interface édition de club -->
{#each clubs as club, i (i)}
	{#if editClub[i]}
		<div class="item-form">
			<h3>Modifier le Club</h3>
			{#if club.name !== 'hors asso'}
				<Param
					label="⛳ Nom de l'association"
					type="text"
					bind:value={club.name}
					placeholder="Nom de l'association"
					focus={true}
				/>
			{:else}
				<h3>Hors association</h3>
			{/if}
			<Param
				label="⛳ Description de l'association"
				type="text"
				bind:value={club.description}
				placeholder="Description de l'association"
			/>
			<Toggle label="Est membre de la Fédération" bind:checked={club.isMember} />
			<div class="action">
				<button onclick={async () => editingClub(i)} class="btn btn-primary">Valider</button>
			</div>
		</div>
	{/if}
{/each}

<!-- Interface création de club -->
{#if addNewClub}
	<div class="item-form">
		<h3>Nouvelle association</h3>
		<Param
			label="⛳ Nom de l'association"
			type="text"
			bind:value={clubName}
			placeholder="Nom de l'association"
			focus={true}
		/>
		<Param
			label="⛳ Description de l'association"
			type="text"
			bind:value={clubDescription}
			placeholder="Description de l'association"
		/>
		<Toggle label="Est membre de la Fédération" bind:checked={isFederationMember} />
		<div class="action">
			<button onclick={createClub} class="btn btn-primary">Créer</button>
			<button onclick={async () => (addNewClub = false)} class="btn">Annuler</button>
		</div>
	</div>
{/if}

{#if showBox}
	<ClubDisplayBox club={clubDisplayed} bind:showBox />
{/if}

<style>
	.details {
		align-items: center;
		box-sizing: border-box;
	}

	.icon {
		font-size: 36px;
		background-color: var(--bg-card);
	}
</style>
