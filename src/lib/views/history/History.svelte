<script lang="ts">
	import { confirmStore } from '$lib/stores/confirmStore.svelte';
	import { base } from '$app/paths';
	import SessionsList from '$lib/components/history/SessionsList.svelte';
	import SessionDetails from '$lib/components/history/SessionDetails.svelte';
	import CoursesList from '$lib/components/history/CoursesList.svelte';
	import { coursesStore } from '$lib/stores/quickSession/coursesStore.svelte';
	import { shareService } from '$lib/utils/shareService';
	import { onMount, onDestroy } from 'svelte';
	import CourseDetails from '$lib/components/history/CourseDetails.svelte';
	import RegularsList from '$lib/components/history/RegularsList.svelte';
	import { regularsStore } from '$lib/stores/quickSession/regularPlayersStore.svelte';
	import { navContext } from '../../utils/nav.svelte.ts';
	import { toastStore } from '$lib/stores/toastStore.svelte';

	let option: string = $state('');
	let currentSession: string = $state('');
	let currentCourse: string = $state('');

	onMount(async () => {
		const importedCourseData = shareService.loadCourseFromUrl();
		if (importedCourseData) {
			if (await confirmStore.prompt('Un parcours a été trouvé via ce lien. Voulez-vous le récéupérer ?')) {
				if (coursesStore.exist(importedCourseData.course.id))
					toastStore.show('Le parcours existe déjà !', 'neutral', 5000);
				else coursesStore.load(importedCourseData.course);

				window.history.replaceState({}, '', window.location.pathname);
			}
		}

		const importedRegularsData = shareService.loadRegularsFromUrl();
		if (importedRegularsData && importedRegularsData.length !== 0) {
			if (await confirmStore.prompt('Une liste de joueurs a été trouvé via ce lien. Voulez-vous les récéupérer ?'))
				regularsStore.loads(importedRegularsData);

			window.history.replaceState({}, '', window.location.pathname);
		}

		// navigationS
		navContext.headerAction = returnButton;
	});

	onDestroy(() => {
		navContext.headerAction = null;
	});
</script>

<!-- Navigation -->
{#snippet returnButton()}
	{#if option === ''}
		<a class="btn btn-back" href={base + '/'}>🏠 Accueil</a>
	{:else if option === 'sessions' && currentSession !== ''}
		<span class="btn btn-back" onclick={async () => (currentSession = '')} role="none">📄 Accueil</span>
	{:else if option === 'courses' && currentCourse !== ''}
		<span class="btn btn-back" onclick={async () => (currentCourse = '')} role="none">⛳ Accueil</span>
	{:else}
		<span class="btn btn-back" onclick={async () => (option = '')} role="none">📜 Accueil</span>
	{/if}
{/snippet}

<!-- Métier -->
{#if option === ''}
	<div class="hub-container">
		<div class="grid-container">
			<div class="card" role="none" onclick={async () => (option = 'sessions')}>
				<span class="icon">📄</span>
				<h3>Sessions</h3>
				<p>Liste des sessions passées</p>
			</div>

			<div class="card" role="none" onclick={async () => (option = 'courses')}>
				<span class="icon">⛳</span>
				<h3>Parcours</h3>
				<p>Liste et partage des parcours</p>
			</div>

			<div class="card" role="none" onclick={async () => (option = 'players')}>
				<span class="icon">👥</span>
				<h3>Joueurs</h3>
				<p>Liste et partage des joueurs réguliers</p>
			</div>
			<a class="card" href={base + '/'}>
				<span class="icon">🏠</span>
				<h3>Retour Accueil</h3>
			</a>
		</div>
	</div>
{/if}

{#if option === 'sessions'}
	<div class="mobile-wizard">
		{#if currentSession === ''}
			<!-- Liste des sessions historisées en local -->
			<SessionsList title="📄 Liste des sessions passées" bind:currentSession />
		{:else}
			<!-- Details de la session	 -->
			<SessionDetails title="📄 Détails de la session" bind:currentSession />
		{/if}
	</div>
{/if}

{#if option === 'courses'}
	<div class="mobile-wizard">
		{#if currentCourse === ''}
			<!-- Liste des parcours enregistrés en local -->
			<CoursesList title="Liste des parcours" bind:currentCourse />
		{:else}
			<!-- Details du parcours	 -->
			<CourseDetails title="Liste des parcours" bind:currentCourse />
		{/if}
	</div>
{/if}

{#if option === 'players'}
	<div class="mobile-wizard">
		<RegularsList title="Liste des joueurs réguliers" />
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
