<script lang="ts">
	import '$lib/styles/scoreCard.css';

	import type { Target } from '$lib/types/targetType';
	import type { RankedPlayer } from '$lib/types/playerType';

	import {
		getScoreClass,
		calculatePlayerScore,
		getTotalPar,
		exportPSCToCSV,
		exportAsImage
	} from '$lib/utils/session/golfScoringFunction.svelte';

	let { rankedPlayers, targets }: { rankedPlayers: RankedPlayer[]; targets: Target[] } = $props<{
		rankedPlayers: RankedPlayer[];
		targets: Target[];
	}>();
</script>

<div class="scorecard" id="PSC-capture">
	<div class="sc-action">
		<span role="none" onclick={() => exportAsImage('PSC-capture')}>📸</span>&nbsp;&nbsp;
		<span role="none" onclick={() => exportPSCToCSV(rankedPlayers, targets)}>📁</span>
	</div>
	<table class="table-container">
		<thead>
			<tr class="header">
				<th class="fixed-column">Cibles</th>
				<th class="vertical-header par-row"><span>Par</span></th>
				<th class="vertical-header par-row"><span>RdJ</span></th>
				{#each rankedPlayers as player}
					<th class="vertical-header"><span>{player.player.name}</span></th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each targets as target, i}
				<tr>
					<td class="fixed-column">{target.name || 'Cible ' + (i + 1)}</td>
					<td class="par-row">{target.par}</td>
					<td class="par-row">{target.rule?.slice(0, 3) || ''}</td>
					{#each rankedPlayers as player}
						{@const score = player.player.scores[target.id]}
						<td class={getScoreClass(score, target)}>
							<div class="shape">
								{(target.rule === 'Bonus' || target.rule === 'Team_Bonus') && score === 0
									? '-'
									: score}
							</div>
						</td>
					{/each}
				</tr>
			{/each}
		</tbody>
		<tfoot>
			<tr class="footer">
				<td class="fixed-column">Total</td>
				<td class="par-row">{getTotalPar(targets)}</td>
				<td class="par-row">|||</td>
				{#each rankedPlayers as player}
					<td>{calculatePlayerScore(player.player, targets)}</td>
				{/each}
			</tr>
		</tfoot>
	</table>
</div>
