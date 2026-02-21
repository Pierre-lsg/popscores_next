<script lang="ts">
	import type { Competition } from '$lib/types/competitionType';
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
			{#if currentCompetition.status === 'setup'}
				<button onclick={() => (currentCompetition.step = 'settings')} class="subnav">
					Définir les règles
				</button>
				<button onclick={() => (currentCompetition.step = 'course')} class="subnav">
					Définir le parcours
				</button>
				<button onclick={() => (currentCompetition.step = 'players')} class="subnav">
					Lister les participants
				</button>
				<button onclick={() => (currentCompetition.step = 'starting')} class="subnav">
					Démarrer la compétition
				</button>
			{/if}

			{#if currentCompetition.status === 'in_progress'}
				<button onclick={() => (currentCompetition.step = 'course')} class="subnav">
					Modifier le parcours
				</button>
				<button onclick={() => (currentCompetition.step = 'scoring')} class="subnav">
					Saisir les scores
				</button>
				<button onclick={() => (currentCompetition.step = 'following')} class="subnav">
					Suivre la compétition
				</button>
			{/if}

			{#if currentCompetition.status === 'finished'}
				<button onclick={() => (currentCompetition.step = 'greeting')} class="subnav">
					Calculer le podium
				</button>
				<button onclick={() => (currentCompetition.step = 'welcome')} class="subnav">
					Boire une bière
				</button>
			{/if}

			{#if currentCompetition.step !== 'welcome'}
				<button onclick={() => (currentCompetition.step = 'welcome')} class="subnav">
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
		z-index: 899;
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
