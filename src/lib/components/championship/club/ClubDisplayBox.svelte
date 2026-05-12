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

<div class="box-screen">
	<div class="content-box">
		<div class="text-center">{club.name}</div>
		<p>Joueurs :</p>
		{formatList(players.map((p) => p.name))}
		<p>Equipes :</p>
		{formatList(teams.map((t) => t.name))}
	</div>
</div>

<svelte:window
	onclick={(e) => {
		// If click out of the display area, leave it
		if (e.target && (e.target as Element).closest('.box-screen')) {
			showBox = false;
		}
	}}
/>
