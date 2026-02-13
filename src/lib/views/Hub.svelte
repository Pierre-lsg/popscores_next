<script lang="ts">
	import { appSettings } from '$lib/stores/settingsStore.svelte';
	import { base } from '$app/paths';
</script>

<h1>Bienvenue au {appSettings.values.clubName}</h1>

<div class="hub-container">
	<div class="grid-container">
		<a class="card" href={base + '/quickSession'}>
			<span class="icon">⛳</span>
			<h3>Partie rapide</h3>
			<p>Suivi de partie entre amis</p>
		</a>

		<a class="card" href={base + '/championship'}>
			<span class="icon">👑</span>
			<h3>Championnat</h3>
			<p>Suivi des compétitions</p>
		</a>

		<a class="card" href={base + '/history'}>
			<span class="icon">📜</span>
			<h3>Historique</h3>
			<p>Revoir les sessions précédentes</p>
		</a>

		<a class="card disabled" href="/">
			<span class="icon">📈</span>
			<h3>Stats Pro</h3>
			<p>Bientôt disponible...</p>
		</a>

		<a class="card" href={base + '/params'}>
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
		padding: 0.5rem;
	}

	@media (max-width: 768px) {
		.grid-container {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			gap: 15px;
			padding: 10px;
		}
	}

	.icon {
		font-size: 2.5rem;
	}

	.disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}
</style>
