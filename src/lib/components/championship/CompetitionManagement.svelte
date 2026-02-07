<script lang="ts">
	import type { Competition } from '$lib/types/competitionType';
	import { competitionStatus } from '$lib/stores/championship/competitionStatusStore.svelte';

	let { currentCompetition = $bindable(''), csId } = $props<{
		currentCompetition: string;
		csId: string;
	}>();
</script>

<div>
	<button onclick={() => (currentCompetition = '')} class="subnav">
		Retour à la liste des compétitions
	</button>

	{#if competitionStatus.status === 'setup'}
		<button onclick={() => alert('Définir le parcours')} class="subnav">
			Définir le parcours
		</button>
		<button onclick={() => alert('Lister les participants')} class="subnav">
			Lister les participants
		</button>
		<button onclick={() => alert('Démarrer la compétition')} class="subnav">
			Démarrer la compétition
		</button>
	{/if}

	{#if competitionStatus.status === 'in_progress'}
		<button onclick={() => alert('Saisir les scores')} class="subnav"> Saisir les scores </button>
		<button onclick={() => alert('Suivre la compétition')} class="subnav">
			Suivre la compétition
		</button>
	{/if}

	{#if competitionStatus.status === 'finished'}
		<button onclick={() => alert('Saisir les scores')} class="subnav"> Calculer le podium </button>
		<button onclick={() => alert('Suivre la compétition')} class="subnav"> Boire une bière </button>
	{/if}

	<h2>Suivi d'une compétition</h2>
	<p>Gestion de la compétition sélectionnée : {currentCompetition}</p>
	<p>Status : {competitionStatus.status}</p>
	<ul>
		<li>Afficher les détails de la compétition</li>
		<li>Gérer les participants</li>
		<li>Suivre les scores en temps réel</li>
	</ul>
</div>
