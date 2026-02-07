<script lang="ts">
	import type { Competition } from '$lib/types/competitionType';
	import CompetitionMenu from './CompetitionMenu.svelte';
	import { competitionStatus } from '$lib/stores/championship/competitionStatusStore.svelte';

	let { currentCompetition = $bindable() } = $props<{
		currentCompetition: Competition | undefined;
	}>();

	const startCompetition = () => {
		competitionStatus.status = 'in_progress';
		competitionStatus.action = 'welcome';
	};
</script>

<div>
	<CompetitionMenu bind:currentCompetition />

	<h2>Commencer la compétition</h2>

	<button onclick={startCompetition} class="subnav"> Lancer la compétition </button>
</div>
