<script lang="ts">
	import type { Competition } from '$lib/types/competitionType';
	import { fade } from 'svelte/transition';

	let { currentCompetition = $bindable() } = $props<{
		currentCompetition: Competition | undefined;
	}>();

	let showMenu: boolean = $state(false);

	const disablingMenu = (menuStep: string, currentStep: string): boolean => {
		if (menuStep === currentStep) return true;
		else return false;
	};
</script>

<svelte:window
	onclick={(e) => {
		// If click out of the display area, leave it
		if (e.target && !(e.target as Element).closest('.menu')) {
			showMenu = false;
		}
	}}
/>

<div>
	<div role="none" onclick={() => (showMenu = !showMenu)} class="menu">☰ Menu ...</div>
	{#if showMenu}
		<div class="menu-details" in:fade={{ duration: 500 }} out:fade={{ duration: 500 }}>
			{#if currentCompetition.status === 'setup'}
				<button
					onclick={() => (currentCompetition.step = 'settings')}
					class="subnav btn btn-primary"
					disabled={disablingMenu('settings', currentCompetition.step)}
				>
					Définir les règles
				</button>
				<button
					onclick={() => (currentCompetition.step = 'course')}
					class="subnav btn btn-primary"
					disabled={disablingMenu('course', currentCompetition.step)}
				>
					Définir le parcours
				</button>
				<button
					onclick={() => (currentCompetition.step = 'players')}
					class="subnav btn btn-primary"
					disabled={disablingMenu('players', currentCompetition.step)}
				>
					Lister les participants
				</button>
				<button
					onclick={() => (currentCompetition.step = 'starting')}
					class="subnav btn btn-primary"
					disabled={disablingMenu('starting', currentCompetition.step)}
				>
					Démarrer la compétition
				</button>
			{/if}

			{#if currentCompetition.status === 'in_progress'}
				<button
					onclick={() => (currentCompetition.step = 'course')}
					class="subnav btn btn-primary"
					disabled={disablingMenu('course', currentCompetition.step)}
				>
					Modifier le parcours
				</button>
				<button
					onclick={() => (currentCompetition.step = 'scoring')}
					class="subnav btn btn-primary"
					disabled={disablingMenu('scoring', currentCompetition.step)}
				>
					Saisir les scores
				</button>
				<button
					onclick={() => (currentCompetition.step = 'following')}
					class="subnav btn btn-primary"
					disabled={disablingMenu('following', currentCompetition.step)}
				>
					Suivre la compétition
				</button>
			{/if}

			{#if currentCompetition.status === 'finished' || currentCompetition.status === 'published'}
				<button
					onclick={() => (currentCompetition.step = 'greeting')}
					class="subnav btn btn-primary"
					disabled={disablingMenu('greeting', currentCompetition.step)}
				>
					Afficher le podium
				</button>
				<button
					onclick={() => (currentCompetition.step = 'welcome')}
					class="subnav btn btn-primary"
				>
					Boire une bière
				</button>
			{/if}
			<button onclick={() => (currentCompetition.step = 'welcome')} class="subnav btn btn-primary">
				Retour à l'accueil de la compétition
			</button>
			<button onclick={() => (currentCompetition = undefined)} class="subnav btn btn-primary">
				Retour à la liste des compétitions
			</button>
		</div>
	{/if}
</div>

<style>
	.menu {
		display: flex;
		flex-direction: column;
		position: fixed;
		font-size: large;
		top: 65px;
		left: 0;
		right: 0;
		z-index: 899;
		background-color: var(--bg-app);
	}

	.menu-details {
		display: flex;
		flex-direction: column;
		position: fixed;
		top: 90px;
		left: 0;
		right: 0;
		z-index: 9999;
	}
</style>
