<script lang="ts">
	import type { Competition } from '$lib/types/competitionType';
	import CompetitionMenu from './CompetitionMenu.svelte';

	let { currentCompetition = $bindable() } = $props<{
		currentCompetition: Competition | undefined;
	}>();
</script>

<div>
	<h2>Suivre les résultats en temps réel</h2>

	<CompetitionMenu bind:currentCompetition />
</div>
