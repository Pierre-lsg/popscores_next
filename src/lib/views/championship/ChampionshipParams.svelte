<script lang="ts">
	import { messageStore } from '$lib/stores/appEventStore.svelte';
	import { toastStore } from '$lib/stores/toastStore.svelte';
	import { championshipService } from '$lib/utils/pocketbase/championships2Cloud';
	import { selection } from '$lib/stores/selection';

	import type { User } from '$lib/types/userType';

	import Param from '$lib/ui/Param.svelte';
	import Stepper from '$lib/ui/Stepper.svelte';
	import ScaleUpdate from '$lib/components/championship/ScaleUpdate.svelte';
	import Selector from '$lib/ui/Selector.svelte';
	import MultiSelector from '$lib/ui/MultiSelector.svelte';

	import { getCsMgrs, getSupervisors } from '$lib/utils/championship/championshipFunctions.svelte';
	import type { Championship } from '$lib/types/championshipType';

	let championship = selection.currentChampionship || ({} as Championship);
	let csMgrs: Promise<User[]> = $state(getCsMgrs(championship));
	let supervisors: Promise<User[]> = $state(getSupervisors(championship));

	const saveChampionshipToCloud = async () => {
		let champToSave = $state.snapshot(championship);

		try {
			championshipService.save(champToSave);
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
		<Param
			label="Description"
			type="text"
			bind:value={championship.description}
			placeholder="Description"
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
		<Stepper
			label="Combien d'équipes scorent lors d'une compétition ?"
			bind:value={championship.maxScoringTeams}
			min={1}
			max={9}
		/>
		{#await csMgrs then csMgrs}
			<MultiSelector
				id="managerSelect"
				bind:value={championship.managersId}
				label="Sélection de responsables"
				options={csMgrs.map((c) => c.id)}
				optionsLabel={csMgrs.map((c) => c.name)}
			/>
		{/await}
		{#await supervisors then supervisors}
			<MultiSelector
				id="supervisorsSelect"
				bind:value={championship.supervisorsId}
				label="Sélection de arbitres"
				options={supervisors.map((s) => s.id)}
				optionsLabel={supervisors.map((s) => s.name)}
			/>
		{/await}
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
