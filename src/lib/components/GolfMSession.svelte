<script lang="ts">
	import { slide } from 'svelte/transition';
	import { sessionSettingsStore } from '$lib/stores/gameSessionStore.svelte';

	import Toggle from '$lib/ui/Toggle.svelte';
	import Param from '$lib/ui/Param.svelte';
	import Stepper from '$lib/ui/Stepper.svelte';

	const weatherOptions = ['Soleil', 'Nuageux', 'Pluie', 'Venté', 'Froid'];
	const s = sessionSettingsStore.settings;
</script>

<div class="step-content" in:slide>
	<div class="setup-fields">
		<Param label="⛳ Nom du Golf" type="text" bind:value={s.locationName} />

		<div class="field">
			<label for="weather">☁️ Météo</label>
			<select id="weather" bind:value={s.weatherCondition}>
				{#each weatherOptions as option}
					<option value={option}>{option}</option>
				{/each}
			</select>
		</div>

		<Toggle label="Malus fixe en cas de X" bind:checked={s.hasCrossAFixedPenalty} />

		{#if s.hasCrossAFixedPenalty}
			<Stepper label="Malus fixe" bind:value={s.malusValue} min={7} />
		{:else}
			<Stepper label="Malus ajouté au Par" bind:value={s.malusOverPar} min={3} />
		{/if}

		<Toggle label="Partie en équipe" bind:checked={s.teamGame} />
		{#if s.teamGame}
			<Stepper label="Nombre de joueurs par équipe" bind:value={s.playersPerTeam} min={2} />
		{/if}
	</div>
</div>

<style>
	.setup-fields {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		background: var(--bg-card);
		padding: 1rem;
		border-radius: 8px;
	}
	select {
		padding: 0.8rem;
		border: 1px solid #ccc;
		border-radius: 4px;
		font-size: 1rem;
	}

	.step-content {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}
</style>
