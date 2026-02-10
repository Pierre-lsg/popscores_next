<script lang="ts">
	import type { Competition } from '$lib/types/competitionType';
	import { competitionStatus } from '$lib/stores/championship/competitionStatusStore.svelte';
	import { fade, fly } from 'svelte/transition';

	let { currentCompetition = $bindable() } = $props<{
		currentCompetition: Competition | undefined;
	}>();

	let showMenu: boolean = $state(false);
</script>

<div>
	<div role="none" onclick={() => (showMenu = !showMenu)} class="menu">☰ Menu ...</div>
	{#if showMenu}
		<div class="menu-details" in:fly={{ duration: 200 }} out:fade>
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
		position: fixed;
		font-size: large;
		top: 56px;
		left: 0;
		right: 0;
		z-index: 9999;
		background-color: var(--bg-app);
	}

	.menu-details {
		display: flex;
		flex-direction: column;
		position: fixed;
		top: 85px;
		left: 0;
		right: 0;
		z-index: 9999;
	}
</style>
