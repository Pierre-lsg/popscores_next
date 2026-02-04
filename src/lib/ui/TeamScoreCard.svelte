<script lang="ts">
	import '$lib/styles/scoreCard.css';

	import type { RankedTeam } from '$lib/types/teamType';
	import type { Target } from '$lib/types/targetsType';
	import type { Player } from '$lib/types/playerType';
	import type { SessionSettings } from '$lib/types/gameSessionType';

	import {
		listTeamPlayer,
		calculateTeamScore,
		getScoreClass,
		getTotalPar
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
		settings: SessionSettings;
	} = $props<{
		rankedTeams: RankedTeam[];
		targets: Target[];
		players: Player[];
		settings: SessionSettings;
	}>();
</script>

<table class="table-container">
	<thead>
		<tr class="header">
			<th rowspan="2" class="fixed-column">Cibles</th>
			<th rowspan="2" class="vertical-header par-row"><span>Par</span></th>
			<th rowspan="2" class="vertical-header par-row"><span>RdJ</span></th>
			{#each rankedTeams as rankedTeam}
				{@const team = rankedTeam.team}
				<th colspan={listTeamPlayer(team, players).length} class="last-cell"
					><span>{team.name}</span></th
				>
			{/each}
		</tr>
		<tr class="header">
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
				<td class="fixed-column">{target.name || 'Trou ' + (i + 1)}</td>
				<td class="par-row">{target.par}</td>
				<td class="par-row">{target.rule?.slice(0, 3) || ''}</td>
				{#each rankedTeams as rankedTeam}
					{@const team = rankedTeam.team}
					{@const teamScore = listTeamPlayer(team, players)[0].scores[target.id]}
					{#if target.rule !== 'Bonus' && target.rule !== 'Individuel'}
						<td
							colspan={listTeamPlayer(team, players).length}
							class="score-cell team-merge {getScoreClass(teamScore, target)}"
						>
							<div class="shape">{teamScore}</div>
						</td>
					{:else}
						{#each listTeamPlayer(team, players) as player, i}
							{@const playerScore = player.scores[target.id]}
							{#if i === listTeamPlayer(team, players).length - 1}
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
			<td class="par-row">{getTotalPar(targets)}</td>
			<td class="par-row">|||</td>
			{#each rankedTeams as rankedTeam}
				{@const team = rankedTeam.team}
				<td colspan={listTeamPlayer(team, players).length} class="last-cell"
					>{calculateTeamScore(team, targets, players, settings)}</td
				>
			{/each}
		</tr>
	</tfoot>
</table>
