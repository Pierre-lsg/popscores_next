<script lang="ts">
	import '$lib/styles/scoreCard.css';

	import type { Target } from '$lib/types/targetsType';
	import type { RankedPlayer } from '$lib/types/playerType';

	import {
		getScoreClass,
		calculatePlayerScore,
		getTotalPar
	} from '$lib/utils/session/golfScoringFunction.svelte';

	let { rankedPlayers, targets }: { rankedPlayers: RankedPlayer[]; targets: Target[] } = $props<{
		rankedPlayers: RankedPlayer[];
		targets: Target[];
	}>();
</script>

<div class="scorecard">
	<table class="scorecard-target">
		<thead>
			<tr class="header">
				<th class="first-fixed-col">Cibles</th>
				{#each targets as target, i}
					<th class="vertical-header">
						<span>{target.name || 'Trou ' + (i + 1)}</span>
					</th>
				{/each}
				<th class="vertical-header"><span>Total</span></th>
			</tr>
			<tr class="header">
				<th class="first-fixed-col">Par</th>
				{#each targets as target, i}
					<th class="vertical-header">
						{target.par}
					</th>
				{/each}
				<th>{getTotalPar(targets)}</th>
			</tr>

			<tr class="header">
				<th class="first-fixed-col">Règle</th>
				{#each targets as target, i}
					<th class="vertical-header">
						{target.rule?.slice(0, 4) || ''}
					</th>
				{/each}
				<th>|||</th>
			</tr>
		</thead>
		<tbody>
			{#each rankedPlayers as player}
				<tr>
					<td class="vertical-header first-fixed-col"><span>{player.player.name}</span></td>
					{#each targets as target, i}
						{@const score = player.player.scores[target.id]}
						<td class={getScoreClass(score, target)}>
							<div class="shape">
								{score}
							</div>
						</td>
					{/each}
					<td>{calculatePlayerScore(player.player, targets)}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
