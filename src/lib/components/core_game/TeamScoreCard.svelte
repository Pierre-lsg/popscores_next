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
		<span role="none" onclick={() => exportAsImage('TSC-capture')}>📸</span>&nbsp;&nbsp;
		<span role="none" onclick={() => exportTSCToCSV(rankedTeams, targets, players, settings)}
			>📁</span
		>
	</div>
	<table class="one_col-score-card" id="TSC-capture">
		<thead>
			<tr class="header">
				<th><div style="width: 100px; position: sticky;">&nbsp;</div></th>
				<th class="par-col"><div style="width: 35px; position: sticky;">&nbsp;</div></th>
				<th class="col-gr"><div style="width: 35px; position: sticky;">&nbsp;</div></th>
				{#each rankedTeams as rankedTeam}
					{@const team = rankedTeam.team}
					<th colspan={listTeamPlayer(team, players).length} class="last-cell"
						><div style="padding: 6px;">{team.name}</div></th
					>
				{/each}
			</tr>
			<tr class="header">
				<th>Cibles</th>
				<th class="vertical-header par-col"><span>Par</span></th>
				<th class="vertical-header col-gr"><span>RdJ</span></th>
				{#each rankedTeams as rankedTeam}
					{@const team = rankedTeam.team}
					{#each listTeamPlayer(team, players) as player, i}
						{#if i === listTeamPlayer(team, players).length - 1}
							<th class="vertical-header last-cell"><span>{player.name}</span></th>
						{:else}
							<th class="vertical-header"><span>{player.name}</span></th>
						{/if}
					{/each}
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each targets as target, i}
				<tr>
					<td>{target.name || 'Cible ' + (i + 1)}</td>
					<td class="par-col">{target.par}</td>
					<td class="col-gr">{target.rule?.slice(0, 3) || ''}</td>
					{#each rankedTeams as rankedTeam}
						{@const team = rankedTeam.team}
						{@const teamScore = listTeamPlayer(team, players)[0].scores[target.id]}
						{#if target.rule !== 'Bonus' && target.rule !== 'Individuel'}
							<td
								colspan={listTeamPlayer(team, players).length}
								class="score-cell team-score {getScoreClass(teamScore, target)}"
							>
								<div class="shape">{teamScore}</div>
							</td>
						{:else}
							{#each listTeamPlayer(team, players) as player, i}
								{@const playerScore = player.scores[target.id]}
								{#if i === listTeamPlayer(team, players).length - 1}
									<td class="score-cell {getScoreClass(playerScore, target)} last-cell">
										<div class="shape">
											{target.rule === 'Bonus' && playerScore === 0 ? '-' : playerScore}
										</div>
									</td>
								{:else}
									<td class="score-cell {getScoreClass(playerScore, target)}">
										<div class="shape">
											{target.rule === 'Bonus' && playerScore === 0 ? '-' : playerScore}
										</div>
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
				<td>Total</td>
				<td class="par-col">{getTotalPar(targets)}</td>
				<td class="col-gr">|||</td>
				{#each rankedTeams as rankedTeam}
					{@const team = rankedTeam.team}
					<td colspan={listTeamPlayer(team, players).length} class="last-cell"
						>{calculateTeamScore(team, targets, players, settings)}</td
					>
				{/each}
			</tr>
		</tfoot>
	</table>
</div>
