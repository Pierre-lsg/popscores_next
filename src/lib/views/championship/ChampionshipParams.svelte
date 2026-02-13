<script lang="ts">
	import { championshipStore } from '$lib/stores/championship/championshipsStore.svelte';
	import { toastStore } from '$lib/stores/toastStore.svelte';
	import { saveChampionship2Cloud } from '$lib/utils/pocketbase/championships2Cloud';
	import type { MarkedPointScale } from '$lib/types/markedPointScaleType';
	import { mpsStore } from '$lib/stores/championship/markedPointScaleStore.svelte';

	import Param from '$lib/ui/Param.svelte';
	import ScaleUpdate from '$lib/components/championship/ScaleUpdate.svelte';
	import { onMount } from 'svelte';

	let csStore = $state(championshipStore.list[0]);

	const saveChampionshipToCloud = async () => {
		let status: string = 'failure';
		let idvScale: MarkedPointScale = mpsStore.list.filter(
			(m) => (m.id = csStore.individualScale)
		)[0];
		let cltScale: MarkedPointScale = mpsStore.list.filter(
			(m) => (m.id = csStore.collectiveScale)
		)[0];
		if (csStore) status = await saveChampionship2Cloud(csStore, idvScale, cltScale);
		if (status === 'success') toastStore.show('💾 Sauvegarde effectuée ...', status);
		else if (status === 'warning') toastStore.show('💾 Session déjà enregistrée ...', status);
		else if (status === 'failure') toastStore.show("💾 Echec à l'enregistrement ...", status);
	};

	const showAvailableChampionship = () => {
		alert('A faire : récupérer et afficher les championnats disponibles');
	};

	onMount(() => {
		if (!csStore) csStore = championshipStore.new();
	});
</script>

<button onclick={() => saveChampionshipToCloud()}>Save</button>

<button onclick={() => showAvailableChampionship()}>Load championship</button>

<div class="settings-page">
	{#if csStore}
		<h2>Paramètres du championnat</h2>
		<Param
			label="Nom du championnat"
			type="text"
			bind:value={csStore.name}
			focus={true}
			placeholder="Nom du championnat"
		/>
		<Param label="Saison" type="text" bind:value={csStore.season} placeholder="Saison" />
		<Param
			label="Localisation"
			type="text"
			bind:value={csStore.location}
			placeholder="Localisation"
		/>
		<h2>Barèmes de points</h2>
		<ScaleUpdate bind:scaleId={csStore.collectiveScale} isIndividual={false} />
		<ScaleUpdate bind:scaleId={csStore.individualScale} isIndividual={true} />
	{/if}
</div>

<style>
	.settings-page {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}
</style>
