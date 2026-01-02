<script lang="ts">
	import { currentPage } from '$lib/stores/routerStore';
	import { settings } from '$lib/stores/settingsStore';
</script>

<h1>Bienvenue au {$settings.clubName}</h1>

<div class="hub-container">
	<h1>Round 2/1 ...</h1>

	<div class="grid-container">
		<button class="card" on:click={() => currentPage.set('golf-score')}>
			<span class="icon">⛳</span>
			<h3>Golf Score</h3>
			<p>Suivi de partie entre amis</p>
		</button>

		<button class="card disabled">
			<span class="icon">📈</span>
			<h3>Stats Pro</h3>
			<p>Bientôt disponible...</p>
		</button>

		<button class="card" on:click={() => currentPage.set('params')}>
			<span class="icon">⚙️</span>
			<h3>Paramétrages</h3>
			<p>Configuration de l'application</p>
		</button>
	</div>
</div>

<style>
	.grid-container {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		gap: 1rem;
		padding: 1rem;
	}

	@media (max-width: 768px) {
		.grid-container {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			gap: 15px;
			padding: 10px;
		}
	}

	.card {
		background: white;
		border: 2px solid #eee;
		border-radius: 12px;
		padding: 1.5rem;
		cursor: pointer;
		transition: transform 0.2s;
	}
	.card:hover {
		transform: translateY(-5px);
		border-color: var(--primary);
	}
	.icon {
		font-size: 2.5rem;
	}
	.disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}
</style>
