<script lang="ts">
	import { playersStore } from '$lib/stores/playersStore.svelte';
	import { teamsStore } from '$lib/stores/teamsStore.svelte';
	import { targetsStore } from '$lib/stores/targetsStore.svelte';

	import { confetti } from '@neoconfetti/svelte';
	import { onMount } from 'svelte';

	import type { Team, RankedTeam } from '$lib/types/teamInterface';
	import type { Player } from '$lib/types/playerInterface';

	import { sessionSettingsStore } from '$lib/stores/gameSessionStore.svelte';
	import {
		calculateTeamScore,
		totalPar,
		listTeamPlayer,
		getRankedTeams,
		getTop3Teams,
		getOthersRankedTeams
	} from '$lib/utils/streetGolfSession/golfScoringFunction.svelte';

	const s = sessionSettingsStore.settings;

	const formatPlayerList = (players: Player[]) => {
		let names = players.map((p) => p.name);
		if (names.length < s.playersPerTeam) names.push('👻');

		// On crée le formateur pour le français
		const formatter = new Intl.ListFormat('fr', {
			style: 'long',
			type: 'conjunction'
		});

		return formatter.format(names);
	};

	let rankedTeams = getRankedTeams(teamsStore.list);
	let top3Teams = getTop3Teams(rankedTeams);
	let othersRankedTeams = getOthersRankedTeams(rankedTeams);

	// Fonction utilitaire pour l'UI (utilisée dans le HTML)
	function getTeamStats(team: Team) {
		const gross = calculateTeamScore(team);
		const diff = gross - totalPar * s.playersPerTeam;
		const diffText = diff > 0 ? `(+${diff})` : diff < 0 ? `(${diff})` : '(E)';

		return { gross, diffText, diff };
	}
	async function shareResults() {
		// 1. On prépare le texte du message
		let message = `🏆 Résultats Golf Score Hub\n\n`;

		rankedTeams.forEach((team, index) => {
			const stats = getTeamStats(team.team);
			const medal = index === 0 ? '🥇 ' : index === 1 ? '🥈 ' : index === 2 ? '🥉 ' : '🔹 ';
			message += `${medal}${team.team.name}: ${stats.gross} ${stats.diffText}\n`;
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

<div use:confetti={{ particleCount: 200 }}></div>

<div class="podium-container">
	<div class="podium-visual">
		{#if top3Teams[1]}
			{@const stats = getTeamStats(top3Teams[1].team)}
			<div class="place silver">
				<span class="podium-score">{stats.gross} ({stats.diff})</span>
				<div class="bar"></div>
				<span class="podium-name">{top3Teams[1].team.name}</span>
				<span class="podium-name">({formatPlayerList(listTeamPlayer(top3Teams[1].team))})</span>
			</div>
		{/if}

		{#if top3Teams[0]}
			{@const stats = getTeamStats(top3Teams[0].team)}
			<div class="place gold">
				<span class="medal">👑</span>
				<span class="podium-score">{stats.gross} ({stats.diff})</span>
				<div class="bar"></div>
				<span class="podium-name">{top3Teams[0].team.name} </span>
				<span class="podium-name">({formatPlayerList(listTeamPlayer(top3Teams[0].team))})</span>
			</div>
		{/if}

		{#if top3Teams[2]}
			{@const stats = getTeamStats(top3Teams[2].team)}
			<div class="place bronze">
				<span class="podium-score">{stats.gross} ({stats.diff})</span>
				<div class="bar"></div>
				<span class="podium-name">{top3Teams[2].team.name}</span>
				<span class="podium-name">({formatPlayerList(listTeamPlayer(top3Teams[2].team))})</span>
			</div>
		{/if}
	</div>

	{#if othersRankedTeams.length > 0}
		<div class="others-list">
			{#each othersRankedTeams as team, i}
				{@const stats = getTeamStats(team.team)}
				<div class="other-item">
					<span class="rank">{i + 4}</span>
					<span class="podium-name">{team.team.name}</span>
					<span class="podium-score">{stats.gross} ({stats.diff})</span>
				</div>
			{/each}
		</div>
	{/if}

	<button class="share-button" onclick={shareResults}>
		<span class="icon">📤</span> Partager les résultats
	</button>
</div>
