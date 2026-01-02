<script>
	import { settings } from '$lib/stores/settingsStore';

	function handleToggle() {
		// Une vibration très courte (10ms) pour simuler un clic physique
		if (typeof navigator !== 'undefined' && navigator.vibrate) {
			navigator.vibrate(10);
		}
	}
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
	<div class="setting-row">
		<span>Utiliser le système Stableford</span>
		<label class="switch">
			<input type="checkbox" bind:checked={$settings.useStableford} on:change={handleToggle} />
			<span class="slider"></span>
		</label>
	</div>
</div>

<style>
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

	label {
		display: flex;
		flex-direction: column;
		font-weight: bold;
	}

	input[type='text'],
	input[type='number'] {
		padding: 0.5rem;
		margin-top: 0.5rem;
		border: 1px solid var(--primary);
		border-radius: 4px;
		font-size: 1rem;
	}

	input[type='checkbox'] {
		margin-right: 0.5rem;
	}

	/* Le conteneur de l'interrupteur */
	.switch {
		position: relative;
		display: inline-block;
		width: 50px;
		height: 28px;
	}

	/* On cache la checkbox par défaut */
	.switch input {
		opacity: 0;
		width: 0;
		height: 0;
	}

	/* Le corps de l'interrupteur (le rail) */
	.slider {
		position: absolute;
		cursor: pointer;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: var(--bg-card);
		transition: 0.4s;
		border-radius: 34px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 1);
	}

	/* Le rond blanc qui bouge */
	.slider:before {
		position: absolute;
		content: '';
		height: 20px;
		width: 20px;
		left: 4px;
		bottom: 4px;
		background-color: white;
		transition: 0.4s;
		border-radius: 50%;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 1);
	}

	/* Couleur quand c'est coché (ton vert golf) */
	input:checked + .slider {
		background-color: #2e7d32;
	}

	/* Mouvement du rond quand c'est coché */
	input:checked + .slider:before {
		transform: translateX(22px);
	}

	/* Accessibilité : bordure quand on navigue au clavier */
	input:focus + .slider {
		box-shadow: 0 0 1px #2e7d32;
	}

	.setting-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 15px 0;
		border-bottom: 1px solid #eee;
	}
</style>
