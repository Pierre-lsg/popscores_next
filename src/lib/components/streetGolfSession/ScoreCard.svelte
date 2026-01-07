<script lang="ts">
	import { sessionSettingsStore } from '$lib/stores/gameSessionStore.svelte';
	import { playersStore } from '$lib/stores/playersStore.svelte';
	import { teamsStore } from '$lib/stores/teamsStore.svelte';
	import { targetsStore } from '$lib/stores/targetsStore.svelte';
	import type { Player } from '$lib/types/playerInterface';

	const s = sessionSettingsStore.settings;

	let isTeamGame: boolean = s.teamGame;

	const calculatePlayerScore = (player: Player) => {
		return targetsStore.list.reduce((sum, target) => {
			return sum + (player.scores[target.id] || 0);
		}, 0);
	};

	const rankedPlayers = $derived(
		[...playersStore.list].sort((a, b) => {
			return calculatePlayerScore(a) - calculatePlayerScore(b);
		})
	);

	const totalPar = $derived(targetsStore.list.reduce((sum, t) => sum + t.par, 0));

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
</script>

{#if isTeamGame}
	<!-- carte de score en équipe -->
	<table class="table-container">
		<thead>
			<tr class="header">
				<th class="fixed-column">Cibles</th>
				<th class="vertical-header"><span>Par</span></th>
				{#each rankedPlayers as player}
					<th class="vertical-header"><span>{player.name}</span></th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each targetsStore.list as target, i}
				<tr>
					<td class="fixed-column">{target.name || 'Trou ' + (i + 1)}</td>
					<td>{target.par}</td>
					{#each rankedPlayers as player}
						<td>{player.scores[target.id]}</td>
					{/each}
				</tr>
			{/each}
			<tr class="footer">
				<td class="fixed-column">Total</td>
				<td>{totalPar}</td>
				{#each rankedPlayers as player}
					<td>{calculatePlayerScore(player)}</td>
				{/each}
			</tr>
		</tbody>
	</table>
{:else}
	<!-- carte de score en individuel -->
{/if}

<style>
	.table-container {
		overflow-x: auto;
		/* On garde la première colonne visible quand on scrolle à droite */
		& th:first-child,
		& td:first-child {
			position: sticky;
			left: 0;
			z-index: 2;
		}
	}

	table {
		border-collapse: collapse;
	}

	.header {
		border-bottom: 2px solid #ddd;
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
</style>
