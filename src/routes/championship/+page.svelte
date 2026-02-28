<script lang="ts">
	import GolfChampionship from '$lib/views/GolfChampionship.svelte';
	import type { Championship } from '$lib/types/championshipType';
	import Selector from '$lib/ui/Selector.svelte';
	import { championshipStore } from '$lib/stores/championship/championshipsStore.svelte';
	import { user } from '$lib/utils/pocketbase/pocketBase';

	import { securityCheck } from '$lib/utils/security';
	import { onMount } from 'svelte';
	import { championshipService } from '$lib/utils/pocketbase/championships2Cloud';
	import { mpsStore } from '$lib/stores/championship/markedPointScaleStore.svelte';
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

	const loadChampionship = () => {
		championshipStore.reset();
		mpsStore.reset();

		let tmpChampionship = cloudChampionships.find((c) => c.id === selectedChampionshipId);
		if (tmpChampionship) {
			let tmpCloudScale = cloudScale.find((cl) => cl.id === tmpChampionship.individualScale);
			if (tmpCloudScale) mpsStore.load(tmpCloudScale);

			tmpCloudScale = cloudScale.find((cl) => cl.id === tmpChampionship.collectiveScale);
			if (tmpCloudScale) mpsStore.load(tmpCloudScale);

			championshipStore.load(tmpChampionship);
			currentChampionship = tmpChampionship;
		}
	};

	const addNewChampionship = () => {
		currentChampionship = championshipStore.new();
	};

	onMount(async () => {
		securityCheck();
		await listCloudChampionship();
		if ($user && !$user?.roles.includes('admin')) {
			// Récupérer directement le championnat si un seul en cours
			cloudChampionships = cloudChampionships.filter((c) => c.status === 'in_progress');
			if (cloudChampionships.length === 1) {
				selectedChampionshipId = cloudChampionships[0].id;
				loadChampionship();
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
