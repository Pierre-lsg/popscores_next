<script lang="ts">
	import {
		getRankedPlayers,
		getPlayerStats,
		getTop3Players,
		getOthersRankedPlayers,
		shareResultsPlayers
	} from '$lib/utils/streetGolfSession/golfScoringFunction.svelte';

	import { targetsStore } from '$lib/stores/targetsStore.svelte';

	import { playersStore } from '$lib/stores/playersStore.svelte';
	import { confetti } from '@neoconfetti/svelte';

	let t = targetsStore.list;

	let rankedPlayers = getRankedPlayers(playersStore.list, targetsStore.list);
	let top3Players = getTop3Players(rankedPlayers);
	let othersRankedPlayers = getOthersRankedPlayers(rankedPlayers);
</script>

<div class="podium-container">
	<div class="podium-visual">
		{#if top3Players[1]}
			{@const stats = getPlayerStats(top3Players[1].player, t)}
			<div class="place silver">
				, <span class="podium-score">{stats.gross} ({stats.diff})</span>
				<div class="bar"></div>
				<span class="podium-name">{top3Players[1].player.name}</span>
			</div>
		{/if}

		{#if top3Players[0]}
			{@const stats = getPlayerStats(top3Players[0].player, t)}
			<div class="place gold">
				<span class="medal">👑</span>
				<span class="podium-score">{stats.gross} ({stats.diff})</span>
				<div class="bar"></div>
				<span class="podium-name">{top3Players[0].player.name}</span>
			</div>
		{/if}

		{#if top3Players[2]}
			{@const stats = getPlayerStats(top3Players[2].player, t)}
			<div class="place bronze">
				<span class="podium-score">{stats.gross} ({stats.diff})</span>
				<div class="bar"></div>
				<span class="podium-name">{top3Players[2].player.name}</span>
			</div>
		{/if}
	</div>

	{#if othersRankedPlayers.length > 0}
		<div class="others-list">
			{#each othersRankedPlayers as player, i}
				{@const stats = getPlayerStats(player.player, t)}
				<div class="other-item">
					<span class="rank">{i + 4}</span>
					<span class="podium-name">{player.player.name}</span>
					<span class="podium-score">{stats.gross} ({stats.diff})</span>
				</div>
			{/each}
		</div>
	{/if}

	<div use:confetti={{ particleCount: 200 }}></div>

	<button class="share-button" onclick={shareResultsPlayers(rankedPlayers, t)}>
		<span class="icon">📤</span> Partager les résultats
	</button>
</div>
