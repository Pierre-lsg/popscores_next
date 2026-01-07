<script lang="ts">
	import { playersStore } from '$lib/stores/playersStore.svelte';
	import { targetsStore } from '$lib/stores/targetsStore.svelte';

	import { ConfettiCannon } from 'svelte-canvas-confetti';
	import { onMount } from 'svelte';

	import type { Player } from '$lib/types/playerInterface';

	let confettiCannon = $state(false);

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

	onMount(() => {
		confettiCannon = true;
	});
</script>

<div class="podium-container">
	<div class="podium-visual">
		{#if top3[1]}
			{@const stats = getPlayerStats(top3[1])}
			<div class="place silver">
				, <span class="podium-score">{stats.gross} ({stats.diff})</span>
				<div class="bar"></div>
				<span class="podium-name">{top3[1].name}</span>
			</div>
		{/if}

		{#if top3[0]}
			{@const stats = getPlayerStats(top3[0])}
			<div class="place gold">
				<span class="medal">👑</span>
				<span class="podium-score">{stats.gross} ({stats.diff})</span>
				<div class="bar"></div>
				<span class="podium-name">{top3[0].name}</span>
			</div>
		{/if}

		{#if top3[2]}
			{@const stats = getPlayerStats(top3[2])}
			<div class="place bronze">
				<span class="podium-score">{stats.gross} ({stats.diff})</span>
				<div class="bar"></div>
				<span class="podium-name">{top3[2].name}</span>
			</div>
		{/if}
	</div>

	{#if others.length > 0}
		<div class="others-list">
			{#each others as player, i}
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
