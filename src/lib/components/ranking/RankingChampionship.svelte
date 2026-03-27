<script lang="ts">
	import '$lib/styles/golfScoring.css';
	import type { Championship } from '$lib/types/championshipType';
	import { clubService } from '$lib/utils/pocketbase/clubs2Cloud';
	import { playerService } from '$lib/utils/pocketbase/players2Cloud';

	let { championship = null } = $props<{
		championship: Championship;
	}>();

	const competitionsPlayerDetails = (p: string) => {
		alert('todo');
	};

	const competitionsClubDetails = (c: string) => {
		alert('todo');
	};
</script>

<h3>Classement par joueur</h3>
<table>
	<thead>
		<tr>
			<th>Position</th>
			<th>Nom du Joueur</th>
			<th>Score</th>
			<th>Détails</th>
		</tr>
	</thead>
	<tbody>
		{#if championship}
			{#each championship.rankingPlayers as p, i}
				{@const player = playerService.getPlayerById(p.id)}
				{#await player}
					<tr><td>...</td><td>...</td><td>...</td><td></td></tr>
				{:then player}
					{#if player}
						<tr>
							<td>#{i + 1}</td>
							<td>{player.name}</td>
							<td>{p.score}</td>
							<td><div role="none" onclick={() => competitionsPlayerDetails(p)}>...</div></td>
						</tr>
					{/if}
				{/await}
			{/each}
		{/if}
	</tbody>
</table>

<h3>Classement par club ...</h3>
<table>
	<thead>
		<tr>
			<th>Position</th>
			<th>Nom du Club</th>
			<th>Score</th>
			<th>Détails</th>
		</tr>
	</thead>
	<tbody>
		{#if championship}
			{#each championship.rankingClubs as c, i}
				{@const club = clubService.getClubById(c.id)}
				{#await club}
					<tr><td>...</td><td>...</td><td>...</td><td></td></tr>
				{:then club}
					{#if club}
						<tr>
							<td>#{i + 1}</td>
							<td>{club.name}</td>
							<td>{c.score}</td>
							<td><div role="none" onclick={() => competitionsClubDetails(c)}>...</div></td>
						</tr>
					{/if}
				{/await}
			{/each}
		{/if}
	</tbody>
</table>
