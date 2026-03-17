<script lang="ts">
	import GolfChampionship from '$lib/views/GolfChampionship.svelte';
	import type { Championship } from '$lib/types/championshipType';
	import Selector from '$lib/ui/Selector.svelte';
	import { championshipStore } from '$lib/stores/championship/championshipsStore.svelte';
	import { user } from '$lib/utils/pocketbase/pocketBase';
	import { securityCheck } from '$lib/utils/security';
	import { loadAChampionship } from '$lib/utils/championship/championshipFunctions.svelte';
	import { onMount } from 'svelte';
	import { championshipService } from '$lib/utils/pocketbase/championships2Cloud';
	import type { MarkedPointScale } from '$lib/types/markedPointScaleType';

	let currentChampionship: Championship | undefined = $state(championshipStore.list[0]);
	let cloudChampionships: Championship[] = $state([]);
	let cloudScale: MarkedPointScale[] = $state([]);
	let loading: boolean = $state(true);
	let selectedChampionshipId: string = $state('');

	const listCloudChampionship = async () => {
		cloudChampionships = await championshipService.getAllChampionships();
		cloudScale = await championshipService.getAllChampionshipsScales();
		loading = false;
	};

	const loadChampionship = async () => {
		let userId: string = '';
		let userRole: string = '';
		if ($user && $user.roles) {
			userId = $user.id;

			if ($user.roles.includes('admin')) userRole = 'admin';
			else if ($user.roles.includes('csMgr')) userRole = 'csMgr';
			else if ($user.roles.includes('cpMgr')) userRole = 'cpMgr';
			else userRole = 'marshall';
		}
		console.log('user role', userRole);
		const tmpChampionship = await loadAChampionship(selectedChampionshipId, userId, userRole);

		if (tmpChampionship) currentChampionship = tmpChampionship;
	};

	const addNewChampionship = () => {
		currentChampionship = championshipStore.new();
	};

	onMount(async () => {
		securityCheck();
		if (!currentChampionship) {
			await listCloudChampionship();
			if ($user && !$user?.roles.includes('admin')) {
				// Récupérer directement le championnat si un seul en cours
				// Et si l'utilisateur est responsable du championnat
				// ou au moins d'une compétition
				cloudChampionships = cloudChampionships.filter((c) => {
					// Todo Corriger la situation 'marshall' en listant les autorisés sur un championnat
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

<!-- Existe un championnat -->
{#if currentChampionship}
	<GolfChampionship bind:currentChampionship />
{:else}
	<!-- Sinon, lister les championnats disponibles en ligne -->
	{#if !loading}
		{#if cloudChampionships.length !== 0}
			<h3>Récupérer un championnat depuis le cloud ☁️</h3>
			<Selector
				id="selectChamp"
				bind:value={selectedChampionshipId}
				label="Championnats connus"
				options={cloudChampionships.map((c) => c.id)}
				optionsLabel={cloudChampionships.map((c) => c.name)}
				unselectedOption="-- choisir un championnat --"
			/>

			<button onclick={() => loadChampionship()}>Sélectionner</button>
		{:else}
			Aucun championnat n'est disponible ...
		{/if}
	{:else}
		<p>Récupération des championnats connus ...</p>
	{/if}

	{#if $user && $user?.roles.includes('admin')}
		<h3>Créer un nouveau championnat 💼</h3>
		<button onclick={() => addNewChampionship()}>Créer nouveau championnat</button>
	{/if}
{/if}
