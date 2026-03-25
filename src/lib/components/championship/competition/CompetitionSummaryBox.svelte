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
		<div class="btn-close" role="none" onclick={() => (showBox = false)}>X</div>
		<CompetitionSummary {currentCompetition} {championship} />
	</div>
</div>

<style>
	.btn-close {
		position: absolute;
		top: 10px;
		right: 10px;
		width: 3vh;
		height: 3vh;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: bolder;
		border-radius: 50%;
		background-color: var(--bg-card);
		color: var(--primary);
	}
</style>
