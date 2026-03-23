<script lang="ts">
	import SessionsList from '$lib/components/history/SessionsList.svelte';
	import SessionDetails from '$lib/components/history/SessionDetails.svelte';
	import CoursesList from '$lib/components/history/CoursesList.svelte';

	let option: string = $state('');
	let currentSession: string = $state('');
</script>

{#if option === ''}
	<div class="hub-container">
		<div class="grid-container">
			<div class="card" role="none" onclick={() => (option = 'sessions')}>
				<span class="icon">📄</span>
				<h3>Sessions</h3>
				<p>Liste des sessions passées</p>
			</div>

			<div class="card" role="none" onclick={() => (option = 'courses')}>
				<span class="icon">⛳</span>
				<h3>Parcours</h3>
				<p>Liste et partage des parcours</p>
			</div>

			<div class="card" role="none" onclick={() => (option = 'players')}>
				<span class="icon">👥</span>
				<h3>Joueurs</h3>
				<p>Liste et partage des joueurs réguliers</p>
			</div>
		</div>
	</div>
{/if}

{#if option === 'sessions'}
	<div class="mobile-wizard">
		<button onclick={() => (option = '')}>Retour</button>
		{#if currentSession === ''}
			<!-- Liste des sessions historisées en local -->
			<SessionsList title="👥 Liste des sessions passées" bind:currentSession />
		{:else}
			<!-- Details de la session	 -->
			<SessionDetails title="📄 Détails de la session" bind:currentSession />
		{/if}
	</div>
{/if}

{#if option === 'courses'}
	<div class="mobile-wizard">
		<button onclick={() => (option = '')}>Retour</button>
		<CoursesList title="Liste des parcours" currentCourse="" />
	</div>
{/if}

{#if option === 'players'}
	<div class="mobile-wizard">
		<button onclick={() => (option = '')}>Retour</button>
		Coming soon ...
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
