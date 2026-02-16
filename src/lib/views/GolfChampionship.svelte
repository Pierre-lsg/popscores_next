<script lang="ts">
	import { base } from '$app/paths';
	import { championshipStore } from '$lib/stores/championship/championshipsStore.svelte';
	import { onMount } from 'svelte';

	let csStore = $state(
		championshipStore.list[0] ? championshipStore.list[0] : championshipStore.new()
	);

	onMount(() => {
		console.log('cs', csStore);
	});
</script>

<h2>Championnat {csStore.name}</h2>

<div class="hub-container">
	<div class="grid-container">
		<a class="card" href={base + '/championship/competitions'}>
			<span class="icon">🏆</span>
			<h3>Compétitions</h3>
			<p>Les étapes du Championnat</p>
		</a>
		<a class="card" href={base + '/championship/players'}>
			<span class="icon">👥</span>
			<h3>Participants</h3>
			<p>Clubs, équipes et joueurs Participants</p>
		</a>

		<a class="card" href={base + '/championship/params'}>
			<span class="icon">⚙️</span>
			<h3>Paramétrages</h3>
			<p>Configuration du championnat</p>
		</a>

		<a class="card" href={base + '/'}>
			<span class="icon">🏠</span>
			<h3>Retour Accueil</h3>
			<p></p>
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
</style>
