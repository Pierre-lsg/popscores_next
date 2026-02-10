<script lang="ts">
	import type { Competition } from '$lib/types/competitionType';
	import { competitionStatus } from '$lib/stores/championship/competitionStatusStore.svelte';

	let { currentCompetition = $bindable() } = $props<{
		currentCompetition: Competition | undefined;
	}>();

	let showMenu: boolean = $state(false);
</script>

<div>
	<div role="none" onclick={() => (showMenu = !showMenu)}>☰ Menu ...</div>
	{#if showMenu}
		<div class="menu">
			{#if competitionStatus.status === 'setup'}
				<button onclick={() => (competitionStatus.action = 'settings')} class="subnav">
					Définir les règles
				</button>
				<button onclick={() => (competitionStatus.action = 'course')} class="subnav">
					Définir le parcours
				</button>
				<button onclick={() => (competitionStatus.action = 'players')} class="subnav">
					Lister les participants
				</button>
				<button onclick={() => (competitionStatus.action = 'starting')} class="subnav">
					Démarrer la compétition
				</button>
			{/if}

			{#if competitionStatus.status === 'in_progress'}
				<button onclick={() => (competitionStatus.action = 'course')} class="subnav">
					Modifier le parcours
				</button>
				<button onclick={() => (competitionStatus.action = 'scoring')} class="subnav">
					Saisir les scores
				</button>
				<button onclick={() => (competitionStatus.action = 'following')} class="subnav">
					Suivre la compétition
				</button>
			{/if}

			{#if competitionStatus.status === 'finished'}
				<button onclick={() => (competitionStatus.action = 'greeting')} class="subnav">
					Calculer le podium
				</button>
				<button onclick={() => (competitionStatus.action = 'welcome')} class="subnav">
					Boire une bière
				</button>
			{/if}

			{#if competitionStatus.action !== 'welcome'}
				<button onclick={() => (competitionStatus.action = 'welcome')} class="subnav">
					Retour à l'accueil de la compétition
				</button>
			{:else}
				<button onclick={() => (currentCompetition = undefined)} class="subnav">
					Retour à la liste des compétitions
				</button>
			{/if}
		</div>
	{/if}
</div>

<style>
	.menu {
		display: flex;
		flex-direction: column;
	}
</style>
