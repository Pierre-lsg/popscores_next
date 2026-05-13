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
	<table class="one_col-score-card">
		<thead>
			<tr class="header">
				<th><div style="width: 100px;">&nbsp;</div></th>
				<th class="par-col"><div style="width: 35px;">&nbsp;</div></th>
				<th class="col-gr"><div style="width: 35px;">&nbsp;</div></th>
				{#each rankedPlayers as player}
					<th class="vertical-header last-cell"><span>&nbsp;</span></th>
				{/each}
			</tr>
			<tr class="header">
				<th>Cibles</th>
				<th class="vertical-header par-col"><span>Par</span></th>
				<th class="vertical-header col-gr"><span>RdJ</span></th>
				{#each rankedPlayers as player}
					<th class="vertical-header last-cell"><span>{player.player.name}</span></th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each targets as target, i}
				<tr>
					<td>{target.name || 'Cible ' + (i + 1)}</td>
					<td class="par-col">{target.par}</td>
					<td class="col-gr">{target.rule?.slice(0, 3) || ''}</td>
					{#each rankedPlayers as player}
						{@const score = player.player.scores[target.id]}
						<td class="score-cell team-score {getScoreClass(score, target)}">
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
				<td>Total</td>
				<td class="par-col">{getTotalPar(targets)}</td>
				<td class="col-gr">|||</td>
				{#each rankedPlayers as player}
					<td class="last-cell">{calculatePlayerScore(player.player, targets)}</td>
				{/each}
			</tr>
		</tfoot>
	</table>
</div>
