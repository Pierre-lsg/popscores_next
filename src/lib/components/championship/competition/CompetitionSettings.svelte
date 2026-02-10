<script lang="ts">
	import type { Competition } from '$lib/types/competitionType';
	import type { Regulations } from '$lib/types/regulationsType';
	import { regulationsStore } from '$lib/stores/championship/regulationsStore.svelte';

	import CompetitionMenu from './CompetitionMenu.svelte';
	import Toggle from '$lib/ui/Toggle.svelte';
	import Stepper from '$lib/ui/Stepper.svelte';
	import { onMount } from 'svelte';

	let rules: Regulations | undefined = $state();

	let { currentCompetition = $bindable() } = $props<{
		currentCompetition: Competition | undefined;
	}>();

	// Chargement du paramétrage de la compétition
	onMount(() => {
		if (currentCompetition) {
			if (currentCompetition.regulationsId !== '')
				rules = regulationsStore.find(currentCompetition.regulationsId);
			if (!rules) {
				rules = regulationsStore.new();
				currentCompetition.regulationsId = rules.id;
			}
		}
	});
</script>

<div>
	<CompetitionMenu bind:currentCompetition />
	<h2>Définir les règles</h2>

	{#if rules}
		<Toggle label="Malus fixe en cas de X" bind:checked={rules.hasCrossAFixedPenalty} />

		{#if rules.hasCrossAFixedPenalty}
			<Stepper label="Malus fixe" bind:value={rules.malusValue} min={7} />
		{:else}
			<Stepper label="Malus ajouté au Par" bind:value={rules.malusOverPar} min={3} />
		{/if}

		<Toggle label="Compétitons en équipe" bind:checked={rules.teamGame} />
		{#if rules.teamGame}
			<Stepper label="Nombre de joueurs par équipe" bind:value={rules.playersPerTeam} min={2} />
			<Stepper label="Nombre d'équipe par fly" bind:value={rules.teamsPerFly} min={2} />
			<Toggle label="Partenaires ghost à 'X'" bind:checked={rules.usePenalizingGhost} />
		{:else}
			<Stepper label="Nombre de joueurs par fly" bind:value={rules.playersPerFly} min={2} />
		{/if}
	{/if}
</div>
