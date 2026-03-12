<script lang="ts">
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

	let clubs = $derived<Club[]>(clubsStore.list.filter((c) => c.championshipId === championship.id));
	let clubDisplayed: Club = $state({
		id: '',
		name: '',
		description: '',
		playersId: [],
		teamsId: [],
		isMember: false,
		championshipId: ''
	});
	let editClub: boolean[] = $state([]);
	let addNewClub: boolean = $state(false);
	let isEditingClub: boolean = $state(false);

	let clubName: string = $state('');
	let clubDescription: string = $state('');
	let showBox: boolean = $state(false);

	let allClubs: Club[] = $state([]);
	let loading = $state(true);
	let knownClubsId: string[] = $derived(clubs.map((c) => c.id));
	let filteredClubs: Club[] = $derived(allClubs.filter((c) => !knownClubsId.includes(c.id)));

	let { currentClub = $bindable(''), championship } = $props<{
		currentClub: string;
		championship: Championship;
	}>();

	const createClub = () => {
		clubsStore.add(clubName, clubDescription, championship.id);
		((clubName = ''), (clubDescription = ''));
		addNewClub = false;
	};
	const removeClub = (id: string) => {
		if (confirm('Voulez-vous vraiment supprimer ce club ?')) {
			clubsStore.remove(id);
		}
		//clubs = clubsStore.list;
	};
	const editingClub = (index: number) => {
		for (let i = 0; i < clubs.length; i++) {
			if (i !== index) editClub[i] = false;
		}
		editClub[index] = !editClub[index];
		isEditingClub = editClub.some((value) => value === true);
	};

	const quickViewTeams = (club: Club) => {
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

	const loadClubfromCloud = (index: number) => {
		// If club doesn't exist
		const aClub = clubsStore.list.filter((c) => c.id === filteredClubs[index].id);
		if (aClub.length == 0) {
			if (confirm('Voulez-vous importer le club ?')) {
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
		allClubs = await clubService.getAllClubsOfChampionship(championship.id);
		loading = false;
	});
</script>

<h2>Clubs</h2>

{#if !isEditingClub && !addNewClub}
	<div class="clubs-list">
		{#each clubs as club, i}
			<div class="club-item">
				<div role="none" class="club-card" onclick={() => (currentClub = club.id)}>
					<div class="details">
						{club.name}
					</div>
					<div style="font-size: smaller;">{club.description.substring(0, 40) + ' ...'}</div>
					<div class="icon">🏆</div>
				</div>
				<div class="action">
					<button onclick={() => removeClub(club.id)}> 🗑️ </button>
					<button onclick={() => editingClub(i)}>✏️</button>
					<button onclick={() => quickViewTeams(club)}>👁️</button>
					<button onclick={() => savingClub(club)}>☁️</button>
				</div>
			</div>
		{/each}

		<!-- Sans club -->
		<div class="club-item">
			<div role="none" class="club-card" onclick={() => (currentClub = 'no_club')}>
				<div class="details">Sans club</div>
				<div style="font-size: smaller;">Equipes et joueurs sans non affiliés à un club</div>
				<div class="icon">❓</div>
			</div>
		</div>
	</div>

	{#if clubs.length === 0}
		<p>Aucun club enregistré pour le moment. 🏆</p>
	{/if}

	<button onclick={() => (addNewClub = true)}>Ajouter un nouveau club</button>

	{#if loading}
		<h3>Clubs disponibles sur le Cloud</h3>
		<p>Chargement ...</p>
	{:else}
		<h3>Clubs disponibles sur le Cloud</h3>
		{#each filteredClubs as c, i}
			<button onclick={() => loadClubfromCloud(i)}>
				<div>{c.name} - {c.description?.slice(0, 30)}</div>
			</button>
		{/each}
	{/if}
{/if}

<!-- Interface édition de club -->
{#each clubs as club, i}
	{#if editClub[i]}
		<div class="club-form">
			<h3>Modifier le Club</h3>
			<Param
				label="⛳ Nom du club"
				type="text"
				bind:value={club.name}
				placeholder="Nom du club"
				focus={true}
			/>
			<Param
				label="⛳ Description du club"
				type="text"
				bind:value={club.description}
				placeholder="Description du club"
			/>
			<Toggle label="Est membre de la Fédération" bind:checked={club.isMember} />
			<div class="action">
				<button onclick={() => editingClub(i)}>Valider</button>
			</div>
		</div>
	{/if}
{/each}

<!-- Interface création de club -->
{#if addNewClub}
	<div class="club-form">
		<h3>Nouveau Club</h3>
		<Param
			label="⛳ Nom du club"
			type="text"
			bind:value={clubName}
			placeholder="Nom du club"
			focus={true}
		/>
		<Param
			label="⛳ Description du club"
			type="text"
			bind:value={clubDescription}
			placeholder="Description du club"
		/>
		<div class="action">
			<button onclick={createClub}>Créer</button>
			<button onclick={() => (addNewClub = false)}>Annuler</button>
		</div>
	</div>
{/if}

{#if showBox}
	<ClubDisplayBox club={clubDisplayed} bind:showBox />
{/if}

<style>
	.club-form {
		border: 1px var(--primary) solid;
		padding: 0.5rem;
		border-radius: 0.5rem;
	}

	.clubs-list {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
	}

	.club-item {
		display: flex;
		flex-direction: column;
		width: 180px;
		margin-bottom: 1rem;
		box-sizing: border-box;
	}

	.club-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		background-color: var(--bg-card);
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		cursor: pointer;
		margin: 0 0.5rem 0 0;
		box-sizing: border-box;
	}

	.club-card:hover {
		transform: translateY(-5px);
		border-color: var(--border-color);
	}

	.details {
		align-items: center;
		box-sizing: border-box;
	}

	.icon {
		font-size: 36px;
		background-color: var(--bg-card);
	}
</style>
