<script lang="ts">
	import { appSettings } from '$lib/stores/settingsStore.svelte';
</script>

<h1>Bienvenue au {appSettings.values.clubName}</h1>

<div class="hub-container">
	<div class="grid-container">
		<a class="card" href="/quickSession">
			<span class="icon">⛳</span>
			<h3>Partie rapide</h3>
			<p>Suivi de partie entre amis</p>
		</a>

		<a class="card" href="/championship">
			<span class="icon">👑</span>
			<h3>Championnat</h3>
			<p>Suivi des compétitions</p>
		</a>

		<a class="card" href="/history">
			<span class="icon">📜</span>
			<h3>Historique</h3>
			<p>Revoir les sessions précédentes</p>
		</a>

		<a class="card disabled" href="/">
			<span class="icon">📈</span>
			<h3>Stats Pro</h3>
			<p>Bientôt disponible...</p>
		</a>

		<a class="card" href="/params">
			<span class="icon">⚙️</span>
			<h3>Paramétrages</h3>
			<p>Configuration de l'application</p>
		</a>
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
		display: flex;
		flex-direction: column;
		text-decoration: none;
		color: var(--text-primary);
		align-items: center;
		justify-content: center;
		text-align: center;
		background: var(--bg-card);
		border: 2px solid var(--border-color);
		border-radius: 12px;
		padding: 1rem;
		cursor: pointer;
		transition: transform 0.2s;
		font-size: 0.9rem;
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
