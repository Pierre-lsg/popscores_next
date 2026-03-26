<script lang="ts">
	import type { Competition } from '$lib/types/competitionType';
	import type { Championship } from '$lib/types/championshipType';
	import CompetitionMenu from './CompetitionMenu.svelte';

	let { currentCompetition = $bindable(), championship = $bindable() } = $props<{
		currentCompetition: Competition | undefined;
		championship: Championship;
	}>();
</script>

<div>
	{#if currentCompetition}
		<p>Compétition en cours.</p>
		<p>Vous pouvez :</p>
		<ul>
			<li>
				<button class="btn btn-primary" onclick={() => (currentCompetition.step = 'scoring')}
					>saisir les scores</button
				>
			</li>
			<li>
				<button class="btn btn-primary" onclick={() => (currentCompetition.step = 'following')}
					>observer le déroulement</button
				>
			</li>
		</ul>
	{:else}
		<p>... erreur lors de l'accès aux informations de la compétition</p>
	{/if}
</div>
