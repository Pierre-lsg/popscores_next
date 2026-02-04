<script lang="ts">
	import type { Competition } from '$lib/types/competitionType';

	let { currentCompetition = $bindable(''), csId } = $props<{
		currentCompetition: string;
		csId: string;
	}>();
</script>

<div>
	<h2>Suivi d'une compétition</h2>
	<p>Gestion de la compétition sélectionnée : {currentCompetition}</p>
	<ul>
		<li>Afficher les détails de la compétition</li>
		<li>Gérer les participants</li>
		<li>Suivre les scores en temps réel</li>
	</ul>
	<button onclick={() => (currentCompetition = '')}> Retour à la liste des compétitions </button>
</div>

<style>
	/* à venir si besoin */
</style>
