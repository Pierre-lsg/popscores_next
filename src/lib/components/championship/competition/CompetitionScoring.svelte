<script lang="ts">
	import type { Competition } from '$lib/types/competitionType';
	import CompetitionMenu from './CompetitionMenu.svelte';
	import { competitionStatus } from '$lib/stores/championship/competitionStatusStore.svelte';

	let { currentCompetition = $bindable() } = $props<{
		currentCompetition: Competition | undefined;
	}>();

	const validating = () => {
		// competitionStatus.status = 'finished';
		// competitionStatus.action = 'welcome';
	};
</script>

<div>
	<CompetitionMenu bind:currentCompetition />
	<h2>Saisir les scores</h2>
	<h3>Sélection par fly</h3>
	<p>Accès externe à cette fonctionnalité. Dans ce cas aucun menu et cadre limité</p>
	<p>Pour chaque trou du parcours</p>
	<p>Consultation à tout moment de la carte de score</p>
	<p>Un fly est comparé à une session du mode 'partie rapide'</p>
	<p>Si tout est saisi, demande de valider la carte avant de la transmettre</p>
	<h3>En organisateur</h3>
	<p>Permettre d'import de carte depuis le Cloud</p>
	<p>Controle de l'état de chaque carte</p>
	<p>Si toutes les cartes validées par les responsables de fly</p>
	<p>--> Validation de la compétition</p>

	<button onclick={validating} class="subnav"> Valider l'ensemble des cartes </button>
</div>
