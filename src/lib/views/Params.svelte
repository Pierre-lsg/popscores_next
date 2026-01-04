<script>
	import { appSettings } from '$lib/stores/settingsStore.svelte';
	import Toggle from '$lib/ui/Toggle.svelte';
	import Param from '$lib/ui/Param.svelte';
	import Stepper from '$lib/ui/Stepper.svelte';
</script>

<div class="settings-page">
	<h2>Paramètres globaux</h2>
	<Param label="Nom du club" type="text" bind:value={appSettings.values.clubName} />
	<Stepper label="Mon Index (HCP)" bind:value={appSettings.values.hcp} min={0} />
	<Toggle label="Calcul Stableford" bind:checked={appSettings.values.useStableford} />

	<h2>Paramètres de sessions de golf</h2>

	<Toggle label="Malus fixe en cas de X" bind:checked={appSettings.values.hasCrossAFixedPenalty} />

	{#if appSettings.values.hasCrossAFixedPenalty}
		<Stepper label="Malus fixe" bind:value={appSettings.values.malusValue} />
	{:else}
		<Stepper label="Malus ajouté au par" bind:value={appSettings.values.malusOverPar} />
	{/if}

	<Toggle label="Partie en équipe" bind:checked={appSettings.values.isTeamGame} />
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
		display: flex;
		flex-direction: column;
		gap: 1rem;
		max-width: 760px;
		margin: auto;
		padding: 1rem;
		background: var(--bg-card);
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}
</style>
