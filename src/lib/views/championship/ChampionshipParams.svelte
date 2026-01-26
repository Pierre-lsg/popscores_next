<script>
	import { championshipStore } from '$lib/stores/championship/championshipsStore.svelte';

	import Param from '$lib/ui/Param.svelte';
	import ScaleUpdater from '$lib/components/championship/ScaleUpdate.svelte';

	const csStore = $state(championshipStore.list[0]);
</script>

<div class="settings-page">
	<h2>Paramètres du championnat</h2>
	<Param label="Nom du championnat" type="text" bind:value={csStore.name} />
	<Param label="Saison" type="text" bind:value={csStore.season} />
	<Param label="Localisation" type="text" bind:value={csStore.location} />
	<h2>Barèmes de points</h2>
	<ScaleUpdater bind:scaleId={csStore.collectiveScale} isIndividual={false} />
	<ScaleUpdater bind:scaleId={csStore.individualScale} isIndividual={true} />
</div>

<style>
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
</style>
