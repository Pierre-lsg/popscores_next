<script lang="ts">
	import type { Target } from '$lib/types/targetType';
	import Map from '$lib/ui/Map.svelte';
	import { calculateDistance } from '$lib/utils/sharedFunction';

	interface Props {
		target: Target;
		showDetails: boolean;
	}

	let { target = {} as Target, showDetails = $bindable(true) }: Props = $props();

	const displayDistance = (target: Target) => {
		if (target.start_pos && target.end_pos) {
			const distance = Math.round(calculateDistance(target.start_pos, target.end_pos));
			if (distance) return distance + ' m';
			else return '???';
		} else return '???';
	};
</script>

<div class="box-screen">
	<div class="content-box">
		<h2>{target.name}</h2>
		<ul>
			<li>Par : {target.par}</li>
			<li>Règles : {target.rule}</li>
			{#if target.start_pos.lat}
				<li>Distance : {displayDistance(target)}</li>
			{/if}
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

		<button onclick={() => (showDetails = false)}>Fermer</button>
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
			showDetails = false;
		}
	}}
/>

<style>
	h4 {
		margin: 0;
	}

	.details {
		margin: 0.2rem 0.2rem 0.5rem 0.2rem;
		background-color: var(--bg-card);
		color: var(--text-main);
	}
</style>
