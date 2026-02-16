<script lang="ts">
	import { championshipStore } from '$lib/stores/championship/championshipsStore.svelte';
	import { toastStore } from '$lib/stores/toastStore.svelte';
	import { championshipService } from '$lib/utils/pocketbase/championships2Cloud';
	import type { MarkedPointScale } from '$lib/types/markedPointScaleType';
	import { mpsStore } from '$lib/stores/championship/markedPointScaleStore.svelte';

	import Param from '$lib/ui/Param.svelte';
	import ScaleUpdate from '$lib/components/championship/ScaleUpdate.svelte';
	import { onMount } from 'svelte';

	let csStore = $state(championshipStore.list[0]);

	const saveChampionshipToCloud = async () => {
		let idvScale: MarkedPointScale | undefined = mpsStore.getScaleById(csStore.individualScale);
		let cltScale: MarkedPointScale | undefined = mpsStore.getScaleById(csStore.collectiveScale);

		try {
			championshipService.saveChampionship(csStore, idvScale, cltScale);
			toastStore.show('💾 Mise à jour effectuée ...', 'success');
		} catch (err) {
			toastStore.show("💾 Echec à l'enregistrement ...", 'failure');
		}
	};

	const showAvailableChampionship = () => {
		alert('A faire : récupérer et afficher les championnats disponibles');
	};
</script>

<button onclick={() => saveChampionshipToCloud()}>Sauvegarde Serveur</button>

<button onclick={() => showAvailableChampionship()}>Charger un autre championnat</button>

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
		<ScaleUpdate scaleId={csStore.collectiveScale} isIndividual={false} />
		<ScaleUpdate scaleId={csStore.individualScale} isIndividual={true} />
	{/if}
</div>

<style>
	.settings-page {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}
</style>
