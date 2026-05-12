<script lang="ts">
	import { confirmStore } from '$lib/stores/confirmStore.svelte';
	import type { Championship } from '$lib/types/championshipType';
	import { base } from '$app/paths';

	import Selector from '$lib/ui/Selector.svelte';
	import Loader from '$lib/ui/Loader.svelte';
	import { toastStore } from '$lib/stores/toastStore.svelte';
	import { championshipStore } from '$lib/stores/championship/championshipsStore.svelte';
	import { userStore } from '$lib/stores/userStore.svelte';
	import { securityCheck } from '$lib/utils/security';
	import { loadAChampionship } from '$lib/utils/championship/championshipFunctions.svelte';
	import { onMount } from 'svelte';
	import { championshipService } from '$lib/utils/pocketbase/championships2Cloud';
	import type { MarkedPointScale } from '$lib/types/markedPointScaleType';
	import { goto } from '$app/navigation';

	let currentChampionship: Championship | undefined = $state(undefined);
	let cloudChampionships: Championship[] = $state([]);
	let cloudScale: MarkedPointScale[] = $state([]);
	let loading: boolean = $state(true);
	let loadingChampionship: boolean = $state(false);
	let selectedChampionshipId: string = $state('');

	const listCloudChampionship = async () => {
		cloudChampionships = await championshipService.getAllChampionships();
		cloudScale = await championshipService.getAllChampionshipsScales();
		loading = false;
	};

	const loadChampionship = async () => {
		loadingChampionship = true;

		if (!(await confirmStore.prompt('Les données du championnat vont être rechargées. \n Voulez-vous continuer ?'))) {
			loadingChampionship = false;
			return false;
		}

		let userId: string = '';
		let userRole: string = '';
		if (userStore.current && userStore.current.roles) {
			userId = userStore.current.id;

			if (userStore.current.roles.includes('admin')) userRole = 'admin';
			else if (userStore.current.roles.includes('csMgr')) userRole = 'csMgr';
			else if (userStore.current.roles.includes('cpMgr')) userRole = 'cpMgr';
			else userRole = 'marshall';
		}

		const tmpChampionship = await loadAChampionship(selectedChampionshipId, userId, userRole);

		if (tmpChampionship) {
			currentChampionship = tmpChampionship;
			goto(base + '/championship/' + currentChampionship.id);
		} else toastStore.show('Aucun championnat sélectionné', 'neutral', 5000);

		loadingChampionship = false;
	};

	const addNewChampionship = async () => {
		currentChampionship = championshipStore.new();
		goto(base + '/championship/' + currentChampionship.id);
	};

	onMount(async () => {
		securityCheck();
		// Récupérer l'ensemble des championnats
		await listCloudChampionship();

		// Si aucun championnat n'est actif dans la section
		if (!currentChampionship) {
			const currentUser = userStore.current;
			if (currentUser && !currentUser.roles.includes('admin')) {
				// Récupérer directement le championnat si un seul en cours
				// Et si l'utilisateur est responsable du championnat
				// ou au moins d'une compétition
				cloudChampionships = cloudChampionships.filter((c) => {
					// Todo Corriger la situation 'marshall' en listant les autorisés sur un championnat
					if (c.status === 'setup' && currentUser.roles.includes('csMgr')) {
						if (c.managersId.includes(currentUser.id)) return true;
					}
					if (c.status === 'in_progress') {
						if (c.managersId.includes(currentUser.id)) return true;
						if (c.cpManagersId.includes(currentUser.id)) return true;
						if (currentUser.roles.includes('marshall')) return true;
					}
					return false;
				});
				if (cloudChampionships.length === 1) {
					selectedChampionshipId = cloudChampionships[0].id;
					loadChampionship();
				}
			}
		}
	});
</script>

<div class="settings-page">
	<!-- Existe un championnat -->
	{#if !currentChampionship}
		<!-- Championnats connus de l'utilisateur -->
		{#if true}
			<h2>Liste des championnats connus</h2>

			<div class="grid-container">
				{#each championshipStore.list as championship}
					<a class="card" href="{base}/championship/{championship.id}">
						<span class="icon">👑</span>
						<h3>{championship.name}</h3>
						<p>{championship.description}</p>
					</a>
				{/each}
			</div>
		{/if}

		<!-- Championnats disponibles dans le Cloud -->
		{#if !loading}
			{#if cloudChampionships.length !== 0}
				<h2>Récupérer un championnat depuis le cloud ☁️</h2>
				<Selector
					id="selectChamp"
					bind:value={selectedChampionshipId}
					label="Championnats connus"
					options={cloudChampionships.map((c) => c.id)}
					optionsLabel={cloudChampionships.map((c) => c.name)}
					unselectedOption="-- choisir un championnat --"
				/>

				<button
					disabled={selectedChampionshipId === ''}
					onclick={async () => loadChampionship()}
					class="btn btn-primary">Sélectionner</button
				>
			{:else}
				Aucun championnat n'est disponible ...
			{/if}
		{:else}
			<p>Récupération des championnats disponibles ...</p>
		{/if}

		<!-- Créer un nouveau championnatt -->
		{#if userStore.current && userStore.current?.roles.includes('admin')}
			<h2>Créer un nouveau championnat 💼</h2>
			<button onclick={async () => addNewChampionship()}>Créer nouveau championnat</button>
		{/if}
	{/if}
</div>

{#if loadingChampionship}
	<div class="splash-screen box-screen">
		<Loader message="Chargement du championnat ..." />
	</div>
{/if}

<style>
	.grid-container {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		gap: 1rem;
		padding: 0.5rem;
	}

	@media (max-width: 768px) {
		.grid-container {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			gap: 15px;
			padding: 10px;
		}
	}
	.icon {
		font-size: 2.5rem;
	}

	.settings-page {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}
</style>
