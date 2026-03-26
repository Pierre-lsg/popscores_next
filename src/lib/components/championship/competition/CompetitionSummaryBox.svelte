<script lang="ts">
	import type { Competition } from '$lib/types/competitionType';
	import type { Championship } from '$lib/types/championshipType';
	import CompetitionSummary from './CompetitionSummary.svelte';

	let {
		currentCompetition,
		championship,
		showBox = $bindable(true)
	} = $props<{
		currentCompetition: Competition | undefined;
		championship: Championship;
		showBox: boolean;
	}>();
</script>

<div class="box-screen">
	<div class="content-box">
		<CompetitionSummary {currentCompetition} {championship} />
	</div>
</div>

<svelte:window
	onclick={(e) => {
		// If click out of the display area, leave it
		if (
			e.target &&
			!(e.target as Element).closest('.content-box') &&
			(e.target as Element).closest('.box-screen')
		) {
			showBox = false;
		}
	}}
/>
