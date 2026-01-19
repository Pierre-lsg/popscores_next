<script lang="ts">
	import { csRouter } from '$lib/stores/routerStore.svelte';
	import { appSettings } from '$lib/stores/settingsStore.svelte';
</script>

<h1>Championnat {appSettings.values.clubName}</h1>

<div class="hub-container">
	<div class="grid-container">
		<button class="card" onclick={() => csRouter.goTo('competition')}>
			<span class="icon">🏆</span>
			<h3>Compétitions</h3>
			<p>Les étapes du Championnat</p>
		</button>

		<button class="card" onclick={() => csRouter.goTo('players')}>
			<span class="icon">👥</span>
			<h3>Participants</h3>
			<p>Clubs, équipes et joueurs Participants</p>
		</button>

		<button class="card" onclick={() => csRouter.goTo('params')}>
			<span class="icon">⚙️</span>
			<h3>Paramétrages</h3>
			<p>Configuration du championnat</p>
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
