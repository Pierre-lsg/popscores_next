<script lang="ts">
	import { slide } from 'svelte/transition';
	import { settings } from '$lib/stores/settingsStore';

	let locationName = '';
	let weatherCondition = 'Soleil';

	let hasCrossAFixedPenalty = $settings.hasCrossAFixedPenalty;
	let malusOverPar = $settings.malusOverPar;
	let fixedMalus = $settings.fixedMalus;
	let teamGame = false;

	const weatherOptions = ['Soleil', 'Nuageux', 'Pluie', 'Venté', 'Froid'];
</script>

<div class="step-content" in:slide>
	<h2>👥 Lieu - règle - date - météo ?</h2>
	<div class="setup-fields">
		<div class="field">
			<label for="golf">⛳ Nom du Golf</label>
			<input id="golf" type="text" bind:value={locationName} placeholder="ex: Golf de Toulouse" />
		</div>

		<div class="field">
			<label for="weather">☁️ Météo</label>
			<select id="weather" bind:value={weatherCondition}>
				{#each weatherOptions as option}
					<option value={option}>{option}</option>
				{/each}
			</select>
		</div>

		<div class="setting-row">
			<span>Malus fixe en cas de X</span>
			<label class="switch">
				<input type="checkbox" bind:checked={hasCrossAFixedPenalty} />
				<span class="slider"></span>
			</label>
		</div>

		<label>
			Malus ajouté au par :
			<input type="number" bind:value={malusOverPar} />
		</label>

		<label>
			Malus fixe :
			<input type="number" bind:value={fixedMalus} />
		</label>

		<div class="setting-row">
			<span>Partie en équipe</span>
			<label class="switch">
				<input type="checkbox" bind:checked={teamGame} />
				<span class="slider"></span>
			</label>
		</div>
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
	input,
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
