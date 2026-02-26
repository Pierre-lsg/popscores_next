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
	<table class="scorecard-target" id="TSCBT-capture">
		<thead>
			<tr class="header">
				<th colspan="2" class="first-fixed-col">Cibles</th>
				{#each targets as target, i}
					<th class="vertical-header">
						<span>{target.name || 'Cible ' + (i + 1)}</span>
					</th>
				{/each}
				<th class="vertical-header"><span>Total</span></th>
			</tr>
			<tr class="header">
				<th colspan="2" class="first-fixed-col">Par</th>
				{#each targets as target, i}
					<th class="vertical-header">
						{target.par}
					</th>
				{/each}
				<th>{getTotalPar(targets)}</th>
			</tr>

			<tr class="header">
				<th colspan="2" class="first-fixed-col">Règle</th>
				{#each targets as target, i}
					<th class="vertical-header">
						{target.rule?.slice(0, 4) || ''}
					</th>
				{/each}
				<th>|||</th>
			</tr>
		</thead>
		<tbody>
			{#each rankedTeams as rankedTeam}
				{@const team = rankedTeam.team}
				{#each listTeamPlayer(team, players) as player, i}
					<tr>
						{#if i === 0}
							<td class="first-fixed-col" rowspan={listTeamPlayer(team, players).length}
								>{team.name}</td
							>
						{/if}
						<td class="second-fixed-col">{player.name}</td>

						{#each targets as target, j}
							{@const playerScore = player.scores[target.id]}
							{#if target.rule !== 'Bonus' && target.rule !== 'Individuel'}
								{#if i === 0}
									<td
										rowspan={listTeamPlayer(team, players).length}
										class="score-cell {getScoreClass(playerScore, target)} last-cell"
									>
										<div class="shape">{playerScore}</div>
									</td>
								{/if}
							{:else}
								<td class="score-cell {getScoreClass(playerScore, target)} last-cell">
									<div class="shape">{playerScore}</div>
								</td>
							{/if}
						{/each}
						{#if i === 0}
							<td rowspan={listTeamPlayer(team, players).length}
								>{calculateTeamScore(team, targets, players, settings)}</td
							>
						{/if}
					</tr>
				{/each}
			{/each}
		</tbody>
	</table>
</div>
