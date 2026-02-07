<script lang="ts">
	import type { Competition } from '$lib/types/competitionType';
	import CompetitionMenu from './CompetitionMenu.svelte';
	import { competitionStatus } from '$lib/stores/championship/competitionStatusStore.svelte';

	let { currentCompetition = $bindable() } = $props<{
		currentCompetition: Competition | undefined;
	}>();

	const validating = () => {
		competitionStatus.status = 'finished';
		competitionStatus.action = 'welcome';
	};
</script>

<div>
	<CompetitionMenu bind:currentCompetition />
	<h2>Saisir les scores</h2>

	<button onclick={validating} class="subnav"> Valider l'ensemble des cartes </button>
</div>
