<script lang="ts">
	import type { Target } from '$lib/types/targetType';
	import Map from '$lib/ui/Map.svelte';

	interface Props {
		target: Target;
		showDetails: boolean;
	}

	let { target = {} as Target, showDetails = $bindable(true) }: Props = $props();
</script>

<div class="container">
	<div class="target-box">
		<h2>{target.name}</h2>
		<ul>
			<li>Par : {target.par}</li>
			<li>Règles : {target.rule}</li>
		</ul>
		{#if target.description.trim() !== ''}
			<h4>Description :</h4>
			<div class="details">{target.description}</div>
		{/if}
		{#if target.start_details.trim() !== ''}
			<h4>Instruction départ :</h4>
			<div class="details">{target.start_details}</div>
		{/if}
		{#if target.end_details.trim() !== ''}
			<h4>Instruction arrivée :</h4>
			<div class="details">{target.end_details}</div>
		{/if}
		{#if target.optional_rules.trim() !== ''}
			<h4>Règles complémentaires :</h4>
			<div class="details">{target.optional_rules}</div>
		{/if}
		{#if target.start_pos.lat && target.end_pos}
			<Map start_pos={target.start_pos} end_pos={target.end_pos} />
		{/if}

		<button onclick={() => (showDetails = false)}>Close</button>
	</div>
</div>

<style>
	h4 {
		margin: 0;
	}

	.details {
		margin: 0.2rem 0.2rem 0.5rem 0.2rem;
		background-color: var(--primary-light);
	}

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

	.target-box {
		display: flex;
		flex-direction: column;
		background-color: var(--bg-card);
		justify-content: center;
		min-height: 30vh;
		width: 100vw;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
	}
</style>
