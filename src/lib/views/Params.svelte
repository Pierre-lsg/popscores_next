<script>
	import { settings } from '$lib/stores/settingsStore';
	import Toggle from '$lib/ui/Toggle.svelte';
	import Param from '$lib/ui/Param.svelte';
</script>

<div class="settings-page">
	<h2>Paramètres globaux</h2>
	<Param label="Nom du club" type="text" bind:value={$settings.clubName} />
	<Param label="Mon Index (HCP)" type="number" bind:value={$settings.hcp} />
	<Toggle label="Calcul Stableford" bind:checked={$settings.useStableford} />

	<h2>Paramètres de sessions de golf</h2>

	<Toggle label="Malus fixe en cas de X" bind:checked={$settings.hasCrossAFixedPenalty} />

	{#if $settings.hasCrossAFixedPenalty}
		<Param label="Malus fixe" type="number" bind:value={$settings.malusValue} />
	{:else}
		<Param label="Malus ajouté au par" type="number" bind:value={$settings.malusOverPar} />
	{/if}

	<Toggle label="Partie en équipe" bind:checked={$settings.teamGame} />
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
