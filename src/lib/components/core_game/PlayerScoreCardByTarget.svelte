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

<div class="scorecard">
	<div class="sc-action">
		<span role="none" onclick={() => exportAsImage('PSCBT-capture')}>📸</span>&nbsp;&nbsp;
		<span role="none" onclick={() => exportPSCToCSV(rankedPlayers, targets)}>📁</span>
	</div>
	<table class="one_col-score-card" id="PSCBT-capture">
		<thead>
			<tr class="header">
				<th class="first-fixed-col"><div style="width: 100px;">Cibles</div></th>
				{#each targets as target, i}
					<th class="vertical-header last-cell">
						<span>{target.name || 'Cible ' + (i + 1)}</span>
					</th>
				{/each}
				<th class="vertical-header last-cell total-column"><span>Total</span></th>
			</tr>
			<tr class="header">
				<th class="first-fixed-col last-cell">Par</th>
				{#each targets as target, i}
					<th class="vertical-header last-cell">
						{target.par}
					</th>
				{/each}
				<th class="last-cell total-column">{getTotalPar(targets)}</th>
			</tr>

			<tr class="header">
				<th class="first-fixed-col last-cell">Règle</th>
				{#each targets as target, i}
					<th class="vertical-header last-cell">
						{target.rule?.slice(0, 4) || ''}
					</th>
				{/each}
				<th class="last-cell total-column">|||</th>
			</tr>
		</thead>
		<tbody>
			{#each rankedPlayers as player}
				<tr>
					<td class="vertical-header first-fixed-col"><span>{player.player.name}</span></td>
					{#each targets as target, i}
						{@const score = player.player.scores[target.id]}
						<td class="score-cell team-score {getScoreClass(score, target)}">
							<div class="shape">
								{(target.rule === 'Bonus' || target.rule === 'Team_Bonus') && score === 0
									? '-'
									: score}
							</div>
						</td>
					{/each}
					<td class="last-cell total-column" style="background-color: var(--bg-card);"
						>{calculatePlayerScore(player.player, targets)}</td
					>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
