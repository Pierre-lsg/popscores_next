<script lang="ts">
	import type { Club } from '$lib/types/clubType';
	import { playersChampionshipStore } from '$lib/stores/championship/playersChampionshipStore.svelte';
	import { formatList } from '$lib/utils/sharedFunction';
	import { teamsChampionshipStore } from '$lib/stores/championship/teamsChampionshipStore.svelte';

	interface Props {
		club: Club;
		showBox: boolean;
	}

	let { club, showBox = $bindable(true) }: Props = $props();

	let players = playersChampionshipStore.list.filter((player) =>
		club.playersId.includes(player.id)
	);

	let teams = teamsChampionshipStore.list.filter((team) => club.teamsId.includes(team.id));
</script>

<div class="container">
	<div class="displayed-box">
		<div style="text-align: center;">{club.name}</div>
		<p>Joueurs :</p>
		{formatList(players.map((p) => p.name))}
		<p>Equipes :</p>
		{formatList(teams.map((t) => t.name))}
	</div>
</div>

<svelte:window
	onclick={(e) => {
		// If click out of the display area, leave it
		if (e.target && (e.target as Element).closest('.displayed-box')) {
			showBox = false;
		}
	}}
/>

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
		max-height: 80vh;
		width: 100vw;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
	}
</style>
