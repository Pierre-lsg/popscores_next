<script lang="ts">
	import { slide } from 'svelte/transition';
	import { sessionSettingsStore } from '$lib/stores/gameSessionStore.svelte';

	import Toggle from '$lib/ui/Toggle.svelte';
	import Param from '$lib/ui/Param.svelte';
	import Stepper from '$lib/ui/Stepper.svelte';
	import DatePicker from '$lib/ui/DatePicker.svelte';
	import Selector from '$lib/ui/Selector.svelte';

	const weatherOptions = ['☀️ Soleil', '☁️ Nuageux', '🌧️ Pluie', '🌬️ Vent', '❄️ Froid'];
	const s = sessionSettingsStore.settings;
</script>

<div class="step-content" in:slide>
	<div class="setup-fields">
		<DatePicker label="📅 Date de la session" bind:value={s.sessionBeginning} />
		<Param label="⛳ Nom du Golf" type="text" bind:value={s.locationName} />
		<Selector
			id="weather"
			label="☁️ Météo"
			bind:value={s.weatherCondition}
			options={weatherOptions}
		/>

		<Toggle label="Malus fixe en cas de X" bind:checked={s.hasCrossAFixedPenalty} />

		{#if s.hasCrossAFixedPenalty}
			<Stepper label="Malus fixe" bind:value={s.malusValue} min={7} />
		{:else}
			<Stepper label="Malus ajouté au Par" bind:value={s.malusOverPar} min={3} />
		{/if}

		<Toggle label="Partie en équipe" bind:checked={s.teamGame} />
		{#if s.teamGame}
			<Stepper label="Nombre de joueurs par équipe" bind:value={s.playersPerTeam} min={2} />
			<Toggle label="Partenaires ghost à 'X'" bind:checked={s.usePenalizingGhost} />
		{/if}
	</div>
</div>

<style>
	.setup-fields {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		background: var(--bg-card);
		padding: 0.5rem;
		border-radius: 8px;
	}

	.step-content {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}
</style>
