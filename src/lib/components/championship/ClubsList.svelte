<script lang="ts">
	import { onMount } from 'svelte';
	import type { Club } from '$lib/types/clubType';
	import { clubsStore } from '$lib/stores/championship/clubsStore.svelte';
	import { teamsChampionshipStore } from '$lib/stores/championship/teamsChampionshipStore.svelte';
	import Param from '$lib/ui/Param.svelte';
	import { getAllClubsFromCloud, saveClub2Cloud } from '$lib/utils/pocketbase/club2Cloud';
	import { saveTeam2Cloud } from '$lib/utils/pocketbase/team2Cloud';

	import { toastStore } from '$lib/stores/toastStore.svelte';

	let clubs = $state<Club[]>(clubsStore.list);
	let editClub: boolean[] = $state([]);

	let addNewClub: boolean = $state(false);

	let clubName: string = $state('Club');
	let clubDescription: string = $state('Description du club');

	let allClubs: Club[] = $state([]);
	let loading = $state(true);
	let knownClubsId: string[] = $derived(clubsStore.list.map((c) => c.id));
	let filteredClubs: Club[] = $derived(allClubs.filter((c) => !knownClubsId.includes(c.id)));

	let { currentClub = $bindable(''), csId } = $props<{
		currentClub: string;
		csId: string;
	}>();

	function createClub() {
		clubsStore.add(clubName, clubDescription);
		addNewClub = false;
	}
	function removeClub(id: string) {
		if (confirm('Voulez-vous vraiment supprimer ce club ?')) {
			clubsStore.remove(id);
		}
		clubs = clubsStore.list;
	}
	function editingClub(index: number) {
		for (let i = 0; i < clubs.length; i++) {
			if (i !== index) editClub[i] = false;
		}
		editClub[index] = !editClub[index];
	}

	function quickViewTeams(index: number) {
		alert(`Affichage rapide des équipes du club : ${clubs[index].name}`);
	}

	const savingClub = async (id: string) => {
		let status: string = 'failure';
		let aClub = clubsStore.find(id);
		if (aClub) status = await saveClub2Cloud(aClub, csId);
		if (status === 'success') toastStore.show('💾 Club sauvegardé ...', status);
		else if (status === 'warning') toastStore.show('💾 Club mis à jour ...', status);
		else if (status === 'failure') toastStore.show('💾 Erreur enregistrement ...', status);
		savingTeams(aClub?.teamsId || [], id);
	};

	const savingTeams = async (ids: string[], clId: string) => {
		let status: string = 'failure';
		for (let id of ids) {
			let aTeam = teamsChampionshipStore.find(id);
			if (aTeam) status = await saveTeam2Cloud(aTeam, clId);
			if (status === 'success') toastStore.show('💾 Equipe sauvegardée ...', status);
			else if (status === 'warning') toastStore.show('💾 Equipe mise à jour ...', status);
			else if (status === 'failure') toastStore.show('💾 Erreur enregistrement ...', status);
		}
	};

	const loadClubfromCloud = (index: number) => {
		// If club doesn't exist
		const aCompet = clubsStore.list.filter((c) => c.id === filteredClubs[index].id);
		if (aCompet.length == 0) {
			if (confirm('Voulez-vous importer le club ?')) {
				const newClub = {
					id: filteredClubs[index].id,
					name: filteredClubs[index].name,
					description: filteredClubs[index].description,
					playersId: filteredClubs[index].playersId,
					teamsId: filteredClubs[index].teamsId
				};
				// Load session to the local Store
				clubsStore.load(newClub);
			}
		}
	};

	onMount(async () => {
		// Retrieve all clubs known in the Cloud
		allClubs = await getAllClubsFromCloud(csId);
		loading = false;
	});
</script>

<h2>Clubs</h2>

<div class="clubs-list">
	{#each clubs as club, i}
		<div class="club-item">
			<div role="none" class="club-card" onclick={() => (currentClub = club.id)}>
				<div class="details">
					{club.name}
				</div>
				<div>{club.description}</div>
				<div class="icon">🏆</div>
			</div>
			<div class="action">
				<button onclick={() => removeClub(club.id)}> 🗑️ </button>
				<button onclick={() => editingClub(i)}>✏️</button>
				<button onclick={() => quickViewTeams(i)}>👁️</button>
				<button onclick={() => savingClub(club.id)}>☁️</button>
			</div>
		</div>
	{/each}
</div>

{#each clubs as club, i}
	{#if editClub[i]}
		<div class="club-form">
			<h3>Modifier le Club</h3>
			<Param label="⛳ Nom du club" type="text" bind:value={club.name} />
			<Param label="⛳ Description du club" type="text" bind:value={club.description} />
		</div>
	{/if}
{/each}

{#if clubs.length === 0}
	<p>Aucun club enregistré pour le moment. 🏆</p>
{/if}

<button onclick={() => (addNewClub = true)}>Ajouter un nouveau club</button>

{#if addNewClub}
	<div class="club-form">
		<h3>Nouveau Club</h3>
		<Param label="⛳ Nom du club" type="text" bind:value={clubName} />
		<Param label="⛳ Description du club" type="text" bind:value={clubDescription} />
		<button onclick={createClub}>Créer</button>
		<button onclick={() => (addNewClub = false)}>Annuler</button>
	</div>
{/if}

<h3>Clubs disponibles sur le Cloud</h3>

{#if loading}
	<p>Chargement ...</p>
{:else}
	{#each filteredClubs as c, i}
		<button onclick={() => loadClubfromCloud(i)}>
			<div>{c.name} - {c.description?.slice(0, 30)}</div>
		</button>
	{/each}
{/if}

<style>
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
		border-color: var(--primary);
	}

	.details {
		align-items: center;
		box-sizing: border-box;
	}

	.icon {
		font-size: 36px;
		background-color: var(--bg-card);
	}

	.action {
		display: flex;
		justify-content: space-between;
		margin: 0 0.5rem 0 0;
	}
</style>
