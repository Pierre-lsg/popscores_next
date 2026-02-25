<script lang="ts">
	import { base } from '$app/paths';
	import { championshipStore } from '$lib/stores/championship/championshipsStore.svelte';
	import ChampionshipRanking from '$lib/components/ChampionshipRanking.svelte';
	import type { Championship } from '$lib/types/championshipType';
	import { user } from '$lib/utils/pocketbase/pocketBase';

	let { currentChampionship = $bindable() } = $props<{
		currentChampionship: Championship;
	}>();

	let showResults: boolean = $state(false);

	const changeChampionship = () => {
		championshipStore.reset();
		window.location.reload();
	};
</script>

<h2>Championnat {currentChampionship.name}</h2>

{#if showResults}
	<button onclick={() => (showResults = false)}>Retour</button>
	<ChampionshipRanking championship={currentChampionship} />
{:else}
	<div class="hub-container">
		<div class="grid-container">
			{#if $user && ($user?.roles.includes('admin') || $user?.roles.includes('csMgr') || $user?.roles.includes('cpMgr'))}
				<a class="card" href={base + '/championship/competitions'}>
					<span class="icon">⛳</span>
					<h3>Compétitions</h3>
					<p>Les étapes du Championnat</p>
				</a>
				<a class="card" href={base + '/championship/players'}>
					<span class="icon">👥</span>
					<h3>Participants</h3>
					<p>Clubs, équipes et joueurs Participants</p>
				</a>
			{/if}

			{#if $user && ($user?.roles.includes('admin') || $user?.roles.includes('csMgr'))}
				<a class="card" href={base + '/championship/params'}>
					<span class="icon">⚙️</span>
					<h3>Paramétrages</h3>
					<p>Configuration du championnat</p>
				</a>
				<div role="none" class="card" onclick={() => (showResults = true)}>
					<span class="icon">🏆</span>
					<h3>Résultats</h3>
					<p>Et accès au détail des compétitions</p>
				</div>
			{/if}

			{#if $user && $user?.roles.includes('marshall')}
				<a class="card" href={base + '/championship/fly'}>
					<span class="icon">⛳</span>
					<h3>Fly</h3>
					<p>Suivi du fly</p>
				</a>
			{/if}
			<a class="card" href={base + '/'}>
				<span class="icon">🏠</span>
				<h3>Retour Accueil</h3>
			</a>

			<div role="none" class="card" onclick={() => changeChampionship()}>
				<span class="icon">🔄</span>
				<h3>Changer de championnat</h3>
			</div>
		</div>
	</div>
{/if}

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
