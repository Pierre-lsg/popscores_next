<script lang="ts">
	import {
		getRankedPlayers,
		getPlayerStats,
		top3Players,
		othersRankedPlayers
	} from '$lib/utils/streetGolfSession/golfScoringFunction.svelte';

	import { ConfettiCannon } from 'svelte-canvas-confetti';
	import { onMount } from 'svelte';

	let confettiCannon = $state(false);
	async function shareResults() {
		// 1. On prépare le texte du message
		let message = `🏆 Résultats Golf Score Hub\n\n`;

		getRankedPlayers().forEach((player, index) => {
			const stats = getPlayerStats(player);
			const medal = index === 0 ? '🥇 ' : index === 1 ? '🥈 ' : index === 2 ? '🥉 ' : '🔹 ';
			message += `${medal}${player.name}: ${stats.gross} ${stats.diffText}\n`;
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

	onMount(() => {
		confettiCannon = true;
	});
</script>

<div class="podium-container">
	<div class="podium-visual">
		{#if top3Players[1]}
			{@const stats = getPlayerStats(top3Players[1])}
			<div class="place silver">
				, <span class="podium-score">{stats.gross} ({stats.diff})</span>
				<div class="bar"></div>
				<span class="podium-name">{top3Players[1].name}</span>
			</div>
		{/if}

		{#if top3Players[0]}
			{@const stats = getPlayerStats(top3Players[0])}
			<div class="place gold">
				<span class="medal">👑</span>
				<span class="podium-score">{stats.gross} ({stats.diff})</span>
				<div class="bar"></div>
				<span class="podium-name">{top3Players[0].name}</span>
			</div>
		{/if}

		{#if top3Players[2]}
			{@const stats = getPlayerStats(top3Players[2])}
			<div class="place bronze">
				<span class="podium-score">{stats.gross} ({stats.diff})</span>
				<div class="bar"></div>
				<span class="podium-name">{top3Players[2].name}</span>
			</div>
		{/if}
	</div>

	{#if othersRankedPlayers.length > 0}
		<div class="others-list">
			{#each othersRankedPlayers as player, i}
				{@const stats = getPlayerStats(player)}
				<div class="other-item">
					<span class="rank">{i + 4}</span>
					<span class="podium-name">{player.name}</span>
					<span class="podium-score">{stats.gross} ({stats.diff})</span>
				</div>
			{/each}
		</div>
	{/if}

	{#if confettiCannon}
		<ConfettiCannon
			origin={[window.innerWidth / 2, window.innerHeight]}
			angle={-90}
			spread={35}
			force={35}
			particleCount={200}
		/>
	{/if}

	<button class="share-button" onclick={shareResults}>
		<span class="icon">📤</span> Partager les résultats
	</button>
</div>
