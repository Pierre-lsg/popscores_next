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

<div class="container">
	<div class="displayed-box">
		<div class="btn-close" role="none" onclick={() => (showBox = false)}>X</div>
		<CompetitionSummary {currentCompetition} {championship} />
	</div>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 999;
		align-items: center;
		justify-content: center;
		height: 100vh;
		width: 100vw;
		margin: 0;
		background-color: rgba(0, 0, 0, 0.6);
	}

	.displayed-box {
		display: flex;
		flex-direction: column;
		background-color: var(--bg-card);
		justify-content: center;
		min-height: 30vh;
		width: 100vw;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
		max-height: 90vh; /* limit the height to 90% of the viewport */
		overflow-y: auto; /* add a vertical scrollbar if needed */
	}

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
