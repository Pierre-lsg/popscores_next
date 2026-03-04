<script lang="ts">
	import { championshipStore } from '$lib/stores/championship/championshipsStore.svelte';
	import { messageStore } from '$lib/stores/appEventStore.svelte';
	import { toastStore } from '$lib/stores/toastStore.svelte';
	import { championshipService } from '$lib/utils/pocketbase/championships2Cloud';
	import type { MarkedPointScale } from '$lib/types/markedPointScaleType';
	import { mpsStore } from '$lib/stores/championship/markedPointScaleStore.svelte';

	import Param from '$lib/ui/Param.svelte';
	import ParamNum from '$lib/ui/ParamNum.svelte';
	import ScaleUpdate from '$lib/components/championship/ScaleUpdate.svelte';
	import Selector from '$lib/ui/Selector.svelte';

	let championship = $state(championshipStore.list[0]);

	const saveChampionshipToCloud = async () => {
		let champToSave = $state.snapshot(championship);
		let idvScale: MarkedPointScale | undefined = mpsStore.getScaleById(champToSave.individualScale);
		let cltScale: MarkedPointScale | undefined = mpsStore.getScaleById(champToSave.collectiveScale);

		try {
			championshipService.saveChampionship(champToSave, idvScale, cltScale);
			toastStore.show('💾 Mise à jour effectuée ...', 'success');
			messageStore.remove('modifChamp');
		} catch (err) {
			toastStore.show("💾 Echec à l'enregistrement ...", 'failure');
		}
	};
</script>

<button onclick={() => saveChampionshipToCloud()}>Sauvegarde Serveur</button>

<div class="settings-page">
	{#if championship}
		<h2>Paramètres du championnat</h2>
		<Param
			label="Nom du championnat"
			type="text"
			bind:value={championship.name}
			focus={true}
			placeholder="Nom du championnat"
		/>
		<Param label="Saison" type="text" bind:value={championship.season} placeholder="Saison" />
		<Param
			label="Localisation"
			type="text"
			bind:value={championship.location}
			placeholder="Localisation"
		/>
		<Selector
			id="statusSelect"
			bind:value={championship.status}
			label="Etat du championnat"
			options={['setup', 'in_progress', 'finished']}
			optionsLabel={['Initialisation', 'En cours', 'Terminé']}
		/>
		<ParamNum
			label="Combien d'équipes scorent lors d'une compétition?"
			bind:value={championship.maxScoringTeams}
			placeholder="1"
		/>
		<h2>Barèmes de points</h2>
		<ScaleUpdate scaleId={championship.collectiveScale} isIndividual={false} />
		<ScaleUpdate scaleId={championship.individualScale} isIndividual={true} />
	{/if}
</div>

<style>
	.settings-page {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}
</style>
