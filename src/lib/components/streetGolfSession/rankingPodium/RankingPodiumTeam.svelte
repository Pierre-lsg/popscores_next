<script lang="ts">
	import { teamsStore } from '$lib/stores/teamsStore.svelte';
	import { targetsStore } from '$lib/stores/targetsStore.svelte';
	import { playersStore } from '$lib/stores/playersStore.svelte';
	import { sessionSettingsStore } from '$lib/stores/gameSessionStore.svelte';

	import { confetti } from '@neoconfetti/svelte';
	import {
		listTeamPlayer,
		formatPlayerList,
		shareResultsTeams,
		getTeamStats,
		getRankedTeams,
		getTop3Teams,
		getOthersRankedTeams
	} from '$lib/utils/streetGolfSession/golfScoringFunction.svelte';

	const s = sessionSettingsStore.settings;
	const t = targetsStore.list;
	const p = playersStore.list;

	let rankedTeams = getRankedTeams(teamsStore.list, t, p, s);
	let top3Teams = getTop3Teams(rankedTeams);
	let othersRankedTeams = getOthersRankedTeams(rankedTeams);
</script>

<div use:confetti={{ particleCount: 200 }}></div>

<div class="podium-container">
	<div class="podium-visual">
		{#if top3Teams[1]}
			{@const stats = getTeamStats(top3Teams[1].team, t, p, s)}
			<div class="place silver">
				<span class="podium-score">{stats.gross} ({stats.diff})</span>
				<div class="bar"></div>
				<span class="podium-name">{top3Teams[1].team.name}</span>
				<span class="podium-name"
					>({formatPlayerList(listTeamPlayer(top3Teams[1].team, p), s)})</span
				>
			</div>
		{/if}

		{#if top3Teams[0]}
			{@const stats = getTeamStats(top3Teams[0].team, t, p, s)}
			<div class="place gold">
				<span class="medal">👑</span>
				<span class="podium-score">{stats.gross} ({stats.diff})</span>
				<div class="bar"></div>
				<span class="podium-name">{top3Teams[0].team.name} </span>
				<span class="podium-name"
					>({formatPlayerList(listTeamPlayer(top3Teams[0].team, p), s)})</span
				>
			</div>
		{/if}

		{#if top3Teams[2]}
			{@const stats = getTeamStats(top3Teams[2].team, t, p, s)}
			<div class="place bronze">
				<span class="podium-score">{stats.gross} ({stats.diff})</span>
				<div class="bar"></div>
				<span class="podium-name">{top3Teams[2].team.name}</span>
				<span class="podium-name"
					>({formatPlayerList(listTeamPlayer(top3Teams[2].team, p), s)})</span
				>
			</div>
		{/if}
	</div>

	{#if othersRankedTeams.length > 0}
		<div class="others-list">
			{#each othersRankedTeams as team, i}
				{@const stats = getTeamStats(team.team, t, p, s)}
				<div class="other-item">
					<span class="rank">{i + 4}</span>
					<span class="podium-name">{team.team.name}</span>
					<span class="podium-score">{stats.gross} ({stats.diff})</span>
				</div>
			{/each}
		</div>
	{/if}

	<button class="share-button" onclick={shareResultsTeams(rankedTeams, t, p, s)}>
		<span class="icon">📤</span> Partager les résultats
	</button>
</div>
