<script lang="ts">
	import { playersStore } from '$lib/stores/playersStore.svelte';
	import { targetsStore } from '$lib/stores/targetsStore.svelte';
	import type { Player } from '$lib/types/playerInterface';

	// Helper interne pour calculer le score d'un joueur basé sur les cibles actuelles
	const calculatePlayerScore = (player: Player) => {
		return targetsStore.list.reduce((sum, target) => {
			return sum + (player.scores[target.id] || 0);
		}, 0);
	};

	// Calcul du Par total du parcours
	const totalPar = $derived(targetsStore.list.reduce((sum, t) => sum + t.par, 0));

	// Classement : Trie les joueurs par score total
	const rankedPlayers = $derived(
		[...playersStore.list].sort((a, b) => {
			return calculatePlayerScore(a) - calculatePlayerScore(b);
		})
	);

	// Dérivations pour l'affichage
	const top3 = $derived(rankedPlayers.slice(0, 3));
	const others = $derived(rankedPlayers.slice(3));

	// Fonction utilitaire pour l'UI (utilisée dans le HTML)
	function getPlayerStats(player: Player) {
		const gross = calculatePlayerScore(player);
		const diff = gross - totalPar;
		const diffText = diff > 0 ? `(+${diff})` : diff < 0 ? `(${diff})` : '(E)';

		return { gross, diffText, diff };
	}
	async function shareResults() {
		// 1. On prépare le texte du message
		let message = `🏆 Résultats Golf Score Hub\n\n`;

		rankedPlayers.forEach((player, index) => {
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
</script>

<div class="podium-container">
	<div class="podium-visual">
		{#if top3[1]}
			{@const stats = getPlayerStats(top3[1])}
			<div class="place silver">
				, <span class="score">{stats.gross} ({stats.diff})</span>
				<div class="bar"></div>
				<span class="name">{top3[1].name}</span>
			</div>
		{/if}

		{#if top3[0]}
			{@const stats = getPlayerStats(top3[1])}
			<div class="place gold">
				<span class="medal">👑</span>
				<span class="score">{stats.gross} ({stats.diff})</span>
				<div class="bar"></div>
				<span class="name">{top3[0].name}</span>
			</div>
		{/if}

		{#if top3[2]}
			{@const stats = getPlayerStats(top3[1])}
			<div class="place bronze">
				<span class="score">{stats.gross} ({stats.diff})</span>
				<div class="bar"></div>
				<span class="name">{top3[2].name}</span>
			</div>
		{/if}
	</div>

	{#if others.length > 0}
		<div class="others-list">
			{#each others as player, i}
				{@const stats = getPlayerStats(player)}
				<div class="other-item">
					<span class="rank">{i + 4}</span>
					<span class="name">{player.name}</span>
					<span class="score">{stats.gross} ({stats.diff})</span>
				</div>
			{/each}
		</div>
	{/if}

	<button class="share-button" onclick={shareResults}>
		<span class="icon">📤</span> Partager les résultats
	</button>
</div>

<style>
	.podium-container {
		width: 100%;
		padding-top: 2rem;
	}

	.podium-visual {
		display: flex;
		align-items: flex-end;
		justify-content: center;
		gap: 10px;
		margin-bottom: 2rem;
		height: 180px;
	}

	.place {
		display: flex;
		flex-direction: column;
		align-items: center;
		flex: 1;
		max-width: 80px;
	}

	.bar {
		width: 100%;
		border-radius: 8px 8px 0 0;
	}
	.name {
		font-size: 0.8rem;
		font-weight: bold;
		margin-top: 5px;
		text-align: center;
	}
	.score {
		font-size: 1.2rem;
		font-weight: 800;
		color: var(--primary);
	}

	/* Hauteurs différentes pour l'effet escalier */
	.gold .bar {
		height: 100px;
		background: #ffd700;
		border: 2px solid #e6c200;
	}
	.silver .bar {
		height: 70px;
		background: #c0c0c0;
		border: 2px solid #a9a9a9;
	}
	.bronze .bar {
		height: 50px;
		background: #cd7f32;
		border: 2px solid #b87333;
	}

	.medal {
		font-size: 1.5rem;
		margin-bottom: 5px;
	}

	.others-list {
		background: #f9f9f9;
		border-radius: 12px;
		padding: 10px;
	}
	.other-item {
		display: flex;
		justify-content: space-between;
		padding: 10px;
		border-bottom: 1px solid #eee;
		background-color: var(--bg-card);
	}
	.rank {
		color: #999;
		font-weight: bold;
		width: 25px;
	}

	.share-button {
		margin-top: 2rem;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		background-color: var(--primary);
		color: white;
		border: none;
		padding: 1rem 2rem;
		border-radius: 50px; /* Style bouton pilule très mobile */
		font-size: 1.1rem;
		font-weight: bold;
		width: 100%;
		box-shadow: 0 4px 15px rgba(46, 125, 50, 0.3);
	}

	.share-button:active {
		transform: scale(0.98);
		background-color: #266b2a;
	}
</style>
