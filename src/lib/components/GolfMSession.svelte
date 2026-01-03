<script lang="ts">
	import { slide } from 'svelte/transition';
	import { sessionSettings } from '$lib/stores/gameSessionStore';

	import Toggle from '$lib/ui/Toggle.svelte';
	import Param from '$lib/ui/Param.svelte';
	import Stepper from '$lib/ui/Stepper.svelte';

	const weatherOptions = ['Soleil', 'Nuageux', 'Pluie', 'Venté', 'Froid'];
</script>

<div class="step-content" in:slide>
	<div class="setup-fields">
		<Param label="⛳ Nom du Golf" type="text" bind:value={$sessionSettings.locationName} />

		<div class="field">
			<label for="weather">☁️ Météo</label>
			<select id="weather" bind:value={$sessionSettings.weatherCondition}>
				{#each weatherOptions as option}
					<option value={option}>{option}</option>
				{/each}
			</select>
		</div>

		<Toggle label="Malus fixe en cas de X" bind:checked={$sessionSettings.hasCrossAFixedPenalty} />

		{#if $sessionSettings.hasCrossAFixedPenalty}
			<Stepper label="Malus fixe" bind:value={$sessionSettings.fixedMalus} min={7} />
		{:else}
			<Stepper label="Malus ajouté au Par" bind:value={$sessionSettings.malusOverPar} min={3} />
		{/if}

		<Toggle label="Partie en équipe" bind:checked={$sessionSettings.teamGame} />
		{#if $sessionSettings.teamGame}
			<Param
				label="Nombre de joueurs par équipe"
				type="number"
				bind:value={$sessionSettings.playersPerTeam}
				inputmode="numeric"
			/>
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
