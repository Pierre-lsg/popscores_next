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

	onMount(() => {
		securityCheck();

		listCloudChampionship();
	});

	const listCloudChampionship = async () => {
		let tmpCloudChamp = await championshipService.getAll();
		if (Array.isArray(tmpCloudChamp)) {
			tmpCloudChamp.forEach((championship) => {
				const c = championship.data;
				cloudChampionships.push({
					id: c.id,
					name: c.name,
					season: c.season,
					location: c.location,
					competitionsId: c.competitionsId,
					individualScale: c.individualScale.id,
					collectiveScale: c.collectiveScale.id,
					rankingClubs: c.rankingClubs,
					rankingPlayers: c.rankingPlayers
				});
				cloudScale.push({
					id: c.individualScale.id,
					name: c.individualScale.name,
					isIndividual: true,
					points: c.individualScale.points
				});
				cloudScale.push({
					id: c.collectiveScale.id,
					name: c.collectiveScale.name,
					isIndividual: false,
					points: c.collectiveScale.points
				});
			});
		}
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
</script>

<!-- Existe un championnat -->
{#if currentChampionship}
	<GolfChampionship bind:currentChampionship />
{:else}
	<!-- Sinon, lister les championnats disponibles en ligne -->
	{#if !loading}
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
		<p>Récupération des championnats connus ...</p>
	{/if}

	{#if $user && $user?.roles.includes('admin')}
		<h3>Créer un nouveau championnat 💼</h3>
		<button onclick={() => addNewChampionship()}>Créer nouveau championnat</button>
	{/if}
{/if}
