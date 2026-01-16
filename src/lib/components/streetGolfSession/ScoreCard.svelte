<script lang="ts">
	import { sessionSettingsStore } from '$lib/stores/gameSessionStore.svelte';

	import {
		calculatePlayerScore,
		getRankedPlayers,
		totalPar,
		listTeamPlayer,
		calculateTeamScore,
		rankedTeams,
		getScoreClass
	} from '$lib/utils/streetGolfSession/golfScoringFunction.svelte';

	import { targetsStore } from '$lib/stores/targetsStore.svelte';
	import { playersStore } from '$lib/stores/playersStore.svelte';

	const s = sessionSettingsStore.settings;

	let isTeamGame: boolean = s.teamGame;

	let rankedPlayerList = $derived(getRankedPlayers(playersStore.list));
</script>

{#if isTeamGame}
	<!-- carte de score en équipe -->
	<h2>Classement par équipe</h2>

	<table class="table-container">
		<thead>
			<tr class="header">
				<th rowspan="2" class="fixed-column">Cibles</th>
				<th rowspan="2" class="vertical-header par-row"><span>Par</span></th>
				{#each rankedTeams as team}
					<th colspan={listTeamPlayer(team).length} class="last-cell"><span>{team.name}</span></th>
				{/each}
			</tr>
			<tr class="header">
				{#each rankedTeams as team}
					{#each listTeamPlayer(team) as player, i}
						{#if i === listTeamPlayer(team).length - 1}
							<th class="vertical-header last-cell"><span>{player.name}</span></th>
						{:else}
							<th class="vertical-header"><span>{player.name}</span></th>
						{/if}
					{/each}
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each targetsStore.list as target, i}
				<tr>
					<td class="fixed-column">{target.name || 'Trou ' + (i + 1)}</td>
					<td class="par-row">{target.par}</td>

					{#each rankedTeams as team}
						{@const teamScore = listTeamPlayer(team)[0].scores[target.id]}
						{#if target.rule !== 'Bonus'}
							<td
								colspan={listTeamPlayer(team).length}
								class="score-cell team-merge {getScoreClass(teamScore, target)}"
							>
								<div class="shape">{teamScore}</div>
							</td>
						{:else}
							{#each listTeamPlayer(team) as player, i}
								{@const playerScore = player.scores[target.id]}
								{#if i === listTeamPlayer(team).length - 1}
									<td class="score-cell {getScoreClass(playerScore, target)} last-cell">
										<div class="shape">{playerScore}</div>
									</td>
								{:else}
									<td class="score-cell {getScoreClass(playerScore, target)}">
										<div class="shape">{playerScore}</div>
									</td>
								{/if}
							{/each}
						{/if}
					{/each}
				</tr>
			{/each}
		</tbody>
		<tfoot>
			<tr class="footer">
				<td class="fixed-column">Total</td>
				<td class="par-row">{totalPar}</td>
				{#each rankedTeams as team}
					<td colspan={listTeamPlayer(team).length} class="last-cell">{calculateTeamScore(team)}</td
					>
				{/each}
			</tr>
		</tfoot>
	</table>
{/if}

<!-- carte de score en individuel -->
<h2>Classement individuel</h2>
<table class="table-container">
	<thead>
		<tr class="header">
			<th class="fixed-column">Cibles</th>
			<th class="vertical-header par-row"><span>Par</span></th>
			{#each rankedPlayerList as player}
				<th class="vertical-header"><span>{player.player.name}</span></th>
			{/each}
		</tr>
	</thead>
	<tbody>
		{#each targetsStore.list as target, i}
			<tr>
				<td class="fixed-column">{target.name || 'Trou ' + (i + 1)}</td>
				<td class="par-row">{target.par}</td>
				{#each rankedPlayerList as player}
					{@const score = player.player.scores[target.id]}
					<td class={getScoreClass(score, target)}>
						<div class="shape">
							{score}
						</div>
					</td>
				{/each}
			</tr>
		{/each}
	</tbody>
	<tfoot>
		<tr class="footer">
			<td class="fixed-column">Total</td>
			<td class="par-row">{totalPar}</td>
			{#each rankedPlayerList as player}
				<td>{calculatePlayerScore(player.player)}</td>
			{/each}
		</tr>
	</tfoot>
</table>

<style>
	.table-container {
		overflow-x: auto;
		/* On garde la première colonne visible quand on scrolle à droite */
		& th:nth-child(1),
		& td:nth-child(1) {
			position: sticky;
			left: 0;
			z-index: 3;
			background-color: var(--bg-card);
		}

		& th:nth-child(2),
		& td:nth-child(2) {
			position: sticky;
			left: 80px; /* À ajuster selon la largeur réelle de ta colonne 1 */
			z-index: 2;
			background-color: var(--bg-card);
		}
	}

	table {
		border-collapse: collapse;
	}

	.header {
		border-bottom: 2px solid #ddd;
	}

	.par-row {
		border-right: 2px solid #ddd;
	}

	.last-cell {
		border-right: 2px solid #ddd;
	}

	.footer {
		border-top: 2px solid #ddd;
	}

	th.vertical-header {
		/* On limite la largeur de la colonne au minimum */
		width: 40px;
		max-height: 150px; /* Hauteur nécessaire pour les noms longs */
		vertical-align: center;
		padding-bottom: 10px;
	}

	th.vertical-header span {
		/* La magie : vertical de bas en haut */
		writing-mode: vertical-rl;
		transform: rotate(180deg);
		text-align: left;
		white-space: nowrap;
		font-size: 0.9rem;
		letter-spacing: 1px;
	}

	/* On stylise la colonne de gauche (nom des trous) pour qu'elle reste lisible */
	.fixed-column {
		text-align: left;
		background-color: var(--bg-card);
		padding-right: 20px;
		border-right: 2px solid #ddd;
	}

	/* Couleur suivant score */
	.score-cell {
		padding: 5px;
		text-align: center;
		vertical-align: middle;
	}

	/* La forme commune (cercle ou carré) */
	.shape {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		margin: auto;
		font-weight: bold;
		font-size: 1.1rem;
		line-height: 1;
	}

	/* Birdie : Un cercle */
	.score-birdie .shape {
		border: 2px solid #333; /* Ou une couleur comme #4caf50 */
		border-radius: 50%;
	}

	/* Eagle (encore plus bas que Birdie) : Double cercle */
	.score-eagle .shape {
		border: 2px solid #333;
		border-radius: 50%;
		box-shadow:
			0 0 0 2px white,
			0 0 0 4px #333; /* Effet double contour */
	}

	/* Bogey : Un carré */
	.score-bogey .shape {
		border: 2px solid #333; /* Ou une couleur comme #ff9800 */
		border-radius: 0; /* Carré parfait */
	}

	/* Double Bogey ou pire : Double carré */
	.score-double-bogey .shape {
		border: 2px solid #333;
		outline: 2px solid #333;
		outline-offset: 2px;
	}

	/* Par : Pas de forme, juste le texte */
	.score-par .shape {
		border: none;
	}

	.team-merge {
		background-color: rgba(0, 0, 0, 0.03); /* Léger fond pour distinguer l'équipe */
		text-align: center;
		font-weight: bold;
		border-left: 2px solid #ccc;
		border-right: 2px solid #ccc;
	}
</style>
