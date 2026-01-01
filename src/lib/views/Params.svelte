<script>
	import { settings } from '$lib/stores/settingsStore';
</script>

<div class="settings-page">
	<label>
		Nom du club :
		<input type="text" bind:value={$settings.clubName} />
	</label>

	<label>
		Mon Index (HCP) :
		<input type="number" bind:value={$settings.hcp} />
	</label>

	<label>
		<input type="checkbox" bind:checked={$settings.useStableford} />
		Calculer en Stableford
	</label>
</div>
