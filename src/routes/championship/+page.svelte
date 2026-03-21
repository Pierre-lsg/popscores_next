<script lang="ts">
	import type { Championship } from '$lib/types/championshipType';
	import { base } from '$app/paths';

	import Selector from '$lib/ui/Selector.svelte';
	import { championshipStore } from '$lib/stores/championship/championshipsStore.svelte';
	import { user } from '$lib/utils/pocketbase/pocketBase';
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

		if (!confirm('Les données du championnat vont être rechargées. \n Voulez-vous continuer ?')) {
			loadingChampionship = false;
			return false;
		}

		let userId: string = '';
		let userRole: string = '';
		if ($user && $user.roles) {
			userId = $user.id;

			if ($user.roles.includes('admin')) userRole = 'admin';
			else if ($user.roles.includes('csMgr')) userRole = 'csMgr';
			else if ($user.roles.includes('cpMgr')) userRole = 'cpMgr';
			else userRole = 'marshall';
		}

		const tmpChampionship = await loadAChampionship(selectedChampionshipId, userId, userRole);

		if (tmpChampionship) {
			currentChampionship = tmpChampionship;
			goto(base + '/championship/' + currentChampionship.id);
		} else alert('Aucun championnat sélectionné');

		loadingChampionship = false;
	};

	const addNewChampionship = () => {
		currentChampionship = championshipStore.new();
		goto(base + '/championship/' + currentChampionship.id);
	};

	onMount(async () => {
		securityCheck();
		// Récupérer l'ensemble des championnats
		await listCloudChampionship();

		// Si aucun championnat n'est actif dans la section
		if (!currentChampionship) {
			if ($user && !$user?.roles.includes('admin')) {
				// Récupérer directement le championnat si un seul en cours
				// Et si l'utilisateur est responsable du championnat
				// ou au moins d'une compétition
				cloudChampionships = cloudChampionships.filter((c) => {
					// Todo Corriger la situation 'marshall' en listant les autorisés sur un championnat
					if (c.status === 'setup' && $user?.roles.includes('csMgr')) {
						if (c.managersId.includes($user.id)) return true;
					}
					if (c.status === 'in_progress') {
						if (c.managersId.includes($user.id)) return true;
						if (c.cpManagersId.includes($user.id)) return true;
						if ($user?.roles.includes('marshall')) return true;
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

				<button disabled={selectedChampionshipId === ''} onclick={() => loadChampionship()}
					>Sélectionner</button
				>
			{:else}
				Aucun championnat n'est disponible ...
			{/if}
		{:else}
			<p>Récupération des championnats disponibles ...</p>
		{/if}

		<!-- Créer un nouveau championnatt -->
		{#if $user && $user?.roles.includes('admin')}
			<h2>Créer un nouveau championnat 💼</h2>
			<button onclick={() => addNewChampionship()}>Créer nouveau championnat</button>
		{/if}
	{/if}
</div>

{#if loadingChampionship}
	<div class="splash-screen">Loading championship ...</div>
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

	h2 {
		margin-bottom: 1rem;
		color: var(--primary);
		text-align: center;
	}

	h2:not(:first-child) {
		border-top: var(--primary) 2px solid;
		padding-top: 1rem;
		margin-top: 2rem;
	}

	.settings-page {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.splash-screen {
		display: flex;
		flex-direction: column;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 999;
		align-items: center;
		justify-content: center;
		height: 100vh;
		width: 100vw;
		margin: 0;
		background-color: rgba(0, 0, 0, 0.8);
		color: white;
		font-size: xx-large;
	}
</style>
