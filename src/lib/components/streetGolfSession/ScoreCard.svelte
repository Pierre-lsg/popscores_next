<script lang="ts">
	import { sessionSettingsStore } from '$lib/stores/gameSessionStore.svelte';

	import {
		calculatePlayerScore,
		rankedPlayers,
		totalPar
	} from '$lib/utils/streetGolfSession/golfScoringFunction';
	import { teamsStore } from '$lib/stores/teamsStore.svelte';
	import { targetsStore } from '$lib/stores/targetsStore.svelte';
	import type { Target } from '$lib/types/targetsInterface';

	const s = sessionSettingsStore.settings;

	let isTeamGame: boolean = s.teamGame;

	/*
	const exportToCSV = (data) => {
		const csvRows = [
			['Trou', 'Par', 'Joueur 1', 'Joueur 2'].join(','), // En-tête
			...data.map((row) => row.join(',')) // Données
		];
		const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.setAttribute('href', url);
		a.setAttribute('download', 'scorecard.csv');
		a.click();
	};
    */

	const getScoreClass = (score: number, target: Target) => {
		if (score === 0) return ''; // Pas encore joué
		if (target.rule === 'Bonus') return 'score-bonus';

		const diff = score - target.par;

		if (diff < 0) return 'score-birdie'; // En dessous du par
		if (diff === 0) return 'score-par'; // Pile le par
		if (diff === 1) return 'score-bogey'; // +1
		return 'score-double-bogey'; // +2 ou plus
	};
</script>

{#if isTeamGame}
	<!-- carte de score en équipe -->
	<h2>Classement par équipe</h2>
{/if}

<!-- carte de score en individuel -->
<h2>Classement individuel</h2>
<table class="table-container">
	<thead>
		<tr class="header">
			<th class="fixed-column">Cibles</th>
			<th class="vertical-header par-row"><span>Par</span></th>
			{#each rankedPlayers as player}
				<th class="vertical-header"><span>{player.name}</span></th>
			{/each}
		</tr>
	</thead>
	<tbody>
		{#each targetsStore.list as target, i}
			<tr>
				<td class="fixed-column">{target.name || 'Trou ' + (i + 1)}</td>
				<td class="par-row">{target.par}</td>
				{#each rankedPlayers as player}
					{@const score = player.scores[target.id]}
					<td class={getScoreClass(score, target)}>
						<div class="shape">
							{score}
						</div>
					</td>
				{/each}
			</tr>
		{/each}
		<tr class="footer">
			<td class="fixed-column">Total</td>
			<td class="par-row">{totalPar}</td>
			{#each rankedPlayers as player}
				<td>{calculatePlayerScore(player)}</td>
			{/each}
		</tr>
	</tbody>
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
</style>
