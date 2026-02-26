<script lang="ts">
	import type { Competition } from '$lib/types/competitionType';
	import type { Regulations } from '$lib/types/regulationsType';

	import CompetitionMenu from './CompetitionMenu.svelte';
	import Toggle from '$lib/ui/Toggle.svelte';
	import Stepper from '$lib/ui/Stepper.svelte';
	import { getRules } from '$lib/utils/championship/competitionsFunctions.svelte';

	let { currentCompetition = $bindable() } = $props<{
		currentCompetition: Competition | undefined;
	}>();
	let rules: Regulations = $state(getRules(currentCompetition));
</script>

<div>
	<CompetitionMenu bind:currentCompetition />
	<h2>Définir les règles</h2>

	{#if rules}
		<Toggle label="Malus fixe en cas de X" bind:checked={rules.regulation.hasCrossAFixedPenalty} />

		{#if rules.regulation.hasCrossAFixedPenalty}
			<Stepper label="Malus fixe" bind:value={rules.regulation.malusValue} min={7} />
		{:else}
			<Stepper label="Malus ajouté au Par" bind:value={rules.regulation.malusOverPar} min={3} />
		{/if}

		<Toggle label="Compétitons en équipe" bind:checked={rules.regulation.teamGame} />
		{#if rules.regulation.teamGame}
			<Stepper
				label="Nombre de joueurs par équipe"
				bind:value={rules.regulation.playersPerTeam}
				min={2}
			/>
			<Stepper label="Nombre d'équipe par fly" bind:value={rules.teamsPerFly} min={2} />
			<Toggle label="Partenaires ghost à 'X'" bind:checked={rules.regulation.usePenalizingGhost} />
		{:else}
			<Stepper label="Nombre de joueurs par fly" bind:value={rules.playersPerFly} min={2} />
			<Toggle label="Calcul d'un classement par équipe" bind:checked={rules.doubleRanking} />
			{#if rules.doubleRanking}
				<Stepper
					label="Nombre de joueurs par équipe virtuelle"
					bind:value={rules.nbPlayersForDoubleRankingTeam}
					min={2}
				/>
			{/if}
		{/if}
	{/if}
</div>
