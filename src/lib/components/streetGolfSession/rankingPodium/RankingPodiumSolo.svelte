<script lang="ts">
	import {
		getRankedPlayers,
		getPlayerStats,
		getTop3Players,
		getOthersRankedPlayers
	} from '$lib/utils/streetGolfSession/golfScoringFunction.svelte';

	import { playersStore } from '$lib/stores/playersStore.svelte';
	import { confetti } from '@neoconfetti/svelte';
	import { onMount } from 'svelte';

	let rankedPlayers = getRankedPlayers(playersStore.list);
	let top3Players = getTop3Players(rankedPlayers);
	let othersRankedPlayers = getOthersRankedPlayers(rankedPlayers);

	async function shareResults() {
		// 1. On prépare le texte du message
		let message = `🏆 Résultats Golf Score Hub\n\n`;

		rankedPlayers.forEach((rankedPlayer, index) => {
			const stats = getPlayerStats(rankedPlayer.player);
			const medal = index === 0 ? '🥇 ' : index === 1 ? '🥈 ' : index === 2 ? '🥉 ' : '🔹 ';
			message += `${medal}${rankedPlayer.player.name}: ${stats.gross} ${stats.diffText}\n`;
		});

		message += `\nJoué avec Golf Score Hub ⛳`;

		// 2. On utilise l'API native
		if (navigator.share) {
			try {
				await navigator.share({
					title: 'Scores de la partie de Golf',
					text: message,
					url: window.location.origin
				});
			} catch (err) {
				console.log('Partage annulé ou erreur:', err);
			}
		} else {
			// Option de secours si le navigateur est trop vieux
			alert("Le partage n'est pas supporté sur ce navigateur. Voici les résultats :\n\n" + message);
		}
	}
</script>

<div class="podium-container">
	<div class="podium-visual">
		{#if top3Players[1]}
			{@const stats = getPlayerStats(top3Players[1].player)}
			<div class="place silver">
				, <span class="podium-score">{stats.gross} ({stats.diff})</span>
				<div class="bar"></div>
				<span class="podium-name">{top3Players[1].player.name}</span>
			</div>
		{/if}

		{#if top3Players[0]}
			{@const stats = getPlayerStats(top3Players[0].player)}
			<div class="place gold">
				<span class="medal">👑</span>
				<span class="podium-score">{stats.gross} ({stats.diff})</span>
				<div class="bar"></div>
				<span class="podium-name">{top3Players[0].player.name}</span>
			</div>
		{/if}

		{#if top3Players[2]}
			{@const stats = getPlayerStats(top3Players[2].player)}
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
				{@const stats = getPlayerStats(player.player)}
				<div class="other-item">
					<span class="rank">{i + 4}</span>
					<span class="podium-name">{player.player.name}</span>
					<span class="podium-score">{stats.gross} ({stats.diff})</span>
				</div>
			{/each}
		</div>
	{/if}

	<div use:confetti={{ particleCount: 200 }}></div>

	<button class="share-button" onclick={shareResults}>
		<span class="icon">📤</span> Partager les résultats
	</button>
</div>
