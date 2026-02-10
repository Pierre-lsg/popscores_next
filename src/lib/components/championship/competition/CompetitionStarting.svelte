<script lang="ts">
	import type { Competition } from '$lib/types/competitionType';
	import CompetitionMenu from './CompetitionMenu.svelte';
	import { competitionStatus } from '$lib/stores/championship/competitionStatusStore.svelte';

	let { currentCompetition = $bindable() } = $props<{
		currentCompetition: Competition | undefined;
	}>();

	const startCompetition = () => {
		//competitionStatus.status = 'in_progress';
		//competitionStatus.action = 'welcome';
	};
</script>

<div>
	<CompetitionMenu bind:currentCompetition />

	<h2>Commencer la compétition</h2>
	<h3>Calculer les flys</h3>
	<p>1 fly est un regroupement de x équipes ou y joueurs suivant les modalités de la compétition</p>
	<p>Une compétition est un ensemble de flys</p>
	<p>Pour les compétitions en équipe</p>
	<p>Pour les compétitions en solo</p>
	<h3>Autoriser les modifications de fly</h3>
	<h3>Si les flys sont OK, lancer la compétition</h3>

	<button onclick={startCompetition} class="subnav"> Lancer la compétition </button>
	<p>Une fois la compétition lancée les flys ne peuvent etre modifié</p>
	<p>
		Au mieux des joueurs et équipes 'sans club' seront ajoutables par le responsable de la carte de
		score
	</p>
</div>
