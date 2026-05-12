<script lang="ts">
	import '$lib/styles/scoreCard.css';

	import type { RankedTeam } from '$lib/types/teamType';
	import type { Target } from '$lib/types/targetType';
	import type { Player } from '$lib/types/playerType';
	import type { Regulation } from '$lib/types/regulationsType';

	import {
		listTeamPlayer,
		calculateTeamScore,
		getScoreClass,
		getTotalPar,
		exportTSCToCSV,
		exportAsImage
	} from '$lib/utils/session/golfScoringFunction.svelte';

	let {
		rankedTeams,
		targets,
		players,
		settings
	}: {
		rankedTeams: RankedTeam[];
		targets: Target[];
		players: Player[];
		settings: Regulation;
	} = $props<{
		rankedTeams: RankedTeam[];
		targets: Target[];
		players: Player[];
		settings: Regulation;
	}>();
</script>

<div class="scorecard">
	<div class="sc-action">
		<span role="none" onclick={() => exportAsImage('TSCBT-capture')}>📸</span>&nbsp;&nbsp;
		<span role="none" onclick={() => exportTSCToCSV(rankedTeams, targets, players, settings)}
			>📁</span
		>
	</div>
	<table class="one_col-score-card" id="TSCBT-capture">
		<thead>
			<tr class="header">
				<th><div style="width: 100px; position: sticky;">&nbsp;</div></th>
				<th class="par-col"><div style="width: 35px; position: sticky;">Cibles</div></th>
				{#each targets as target, i}
					<th class="vertical-header last-cell">
						<span>{target.name || 'Cible ' + (i + 1)}</span>
					</th>
				{/each}
				<th class="vertical-header last-cell"><span>Total</span></th>
			</tr>
			<tr class="header">
				<th>&nbsp;</th>
				<th class="par-col">Par</th>
				{#each targets as target, i}
					<th class="vertical-header last-cell">
						{target.par}
					</th>
				{/each}
				<th class="last-cell">{getTotalPar(targets)}</th>
			</tr>

			<tr class="header">
				<th>&nbsp;</th>
				<th class="par-col">Règles</th>
				{#each targets as target, i}
					<th class="vertical-header last-cell">
						{target.rule?.slice(0, 4) || ''}
					</th>
				{/each}
				<th class="last-cell">|||</th>
			</tr>
		</thead>
		<tbody>
			{#each rankedTeams as rankedTeam, r}
				{@const team = rankedTeam.team}
				<tr>
					<td>
						<div class="font-bold">#{r + 1}</div>
						<div>{team.name}</div>
					</td>
					<td class="par-col last-cell">
						{#each listTeamPlayer(team, players) as player, i}
							<div style="padding: 6px">{player.name}</div>
						{/each}
					</td>

					{#each targets as target, j}
						<td class="last-cell">
							{#each listTeamPlayer(team, players) as player, i}
								{@const playerScore = player.scores[target.id]}
								{#if target.rule !== 'Bonus' && target.rule !== 'Individuel'}
									{#if i === 0}
										<div class={getScoreClass(playerScore, target)}>
											<div class="shape">
												{target.rule === 'Bonus' && playerScore === 0 ? '-' : playerScore}
											</div>
										</div>
									{/if}
								{:else}
									<div class={getScoreClass(playerScore, target)}>
										<div class="shape">
											{target.rule === 'Bonus' && playerScore === 0 ? '-' : playerScore}
										</div>
									</div>
								{/if}
							{/each}
						</td>
					{/each}
					<td class="last-cell">{calculateTeamScore(team, targets, players, settings)}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
