<script lang="ts">
	import { playersStore } from '$lib/stores/playersStore.svelte';
	import { teamsStore } from '$lib/stores/teamsStore.svelte';
	import { targetsStore } from '$lib/stores/targetsStore.svelte';
	import type { Player } from '$lib/types/playerInterface';

	import { ConfettiCannon } from 'svelte-canvas-confetti';
	import { onMount } from 'svelte';

	import type { Team } from '$lib/types/teamInterface';
	import { sessionSettingsStore } from '$lib/stores/gameSessionStore.svelte';

	const s = sessionSettingsStore.settings;

	let confettiCannon = $state(false);

	// Calcule le score de l'équipe
	const calculateTeamScore = (team: Team) => {
		// Pour toutes les cibles du parcours
		return targetsStore.list.reduce((sum, target) => {
			// 1. Récupération des scores réels présents
			const scores = team.playersId.map((id) => {
				const p = playersStore.list.find((p) => p.id === id);
				return p?.scores[target.id] || 0;
			});

			// 2. Injection des fantômes si l'équipe est incomplète
			while (scores.length < s.playersPerTeam) {
				let ghostValue: number;
				switch (target.rule) {
					case 'Bonus':
						ghostValue = 0;
						break;
					case 'Individuel':
						if (s.usePenalizingGhost) {
							if (s.hasCrossAFixedPenalty) ghostValue = s.malusValue;
							else ghostValue = target.par + s.malusOverPar;
						} else ghostValue = scores[0];
						break;
					default:
						ghostValue = scores[0];
						break;
				}
				scores.push(ghostValue);
			}

			// 3. Somme des scores de la cible pour l'équipe
			const targetTotal = scores.reduce((a, b) => a + b, 0);

			return sum + targetTotal;
		}, 0);
	};

	// Liste les joueurs de l'équipe
	const listTeamPlayer = (team: Team) => {
		// On mappe les IDs de l'équipe vers les objets joueurs du store
		return team.playersId
			.map((id) => {
				return playersStore.list.find((p) => p.id === id);
			})
			.filter((p) => p !== undefined); // Sécurité pour éviter les éléments vides
	};

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

	// Calcul du Par total du parcours
	const totalPar: number = $derived(targetsStore.list.reduce((sum, t) => sum + t.par, 0));

	// Classement : Trie les équipes par score total
	const rankedTeams = $derived(
		[...teamsStore.list].sort((a, b) => {
			return calculateTeamScore(a) - calculateTeamScore(b);
		})
	);

	// Dérivations pour l'affichage
	const top3 = $derived(rankedTeams.slice(0, 3));
	const others = $derived(rankedTeams.slice(3));

	// Fonction utilitaire pour l'UI (utilisée dans le HTML)
	function getTeamStats(team: Team) {
		const gross = calculateTeamScore(team);
		const diff = gross - totalPar;
		const diffText = diff > 0 ? `(+${diff})` : diff < 0 ? `(${diff})` : '(E)';

		return { gross, diffText, diff };
	}
	async function shareResults() {
		// 1. On prépare le texte du message
		let message = `🏆 Résultats Golf Score Hub\n\n`;

		rankedTeams.forEach((team, index) => {
			const stats = getTeamStats(team);
			const medal = index === 0 ? '🥇 ' : index === 1 ? '🥈 ' : index === 2 ? '🥉 ' : '🔹 ';
			message += `${medal}${team.name}: ${stats.gross} ${stats.diffText}\n`;
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
			{@const stats = getTeamStats(top3[1])}
			<div class="place silver">
				<span class="podium-score">{stats.gross} ({stats.diff})</span>
				<div class="bar"></div>
				<span class="podium-name">{top3[1].name}</span>
				<span class="podium-name">({formatPlayerList(listTeamPlayer(top3[1]))})</span>
			</div>
		{/if}

		{#if top3[0]}
			{@const stats = getTeamStats(top3[0])}
			<div class="place gold">
				<span class="medal">👑</span>
				<span class="podium-score">{stats.gross} ({stats.diff})</span>
				<div class="bar"></div>
				<span class="podium-name">{top3[0].name} </span>
				<span class="podium-name">({formatPlayerList(listTeamPlayer(top3[0]))})</span>
			</div>
		{/if}

		{#if top3[2]}
			{@const stats = getTeamStats(top3[2])}
			<div class="place bronze">
				<span class="podium-score">{stats.gross} ({stats.diff})</span>
				<div class="bar"></div>
				<span class="podium-name">{top3[2].name}</span>
				<span class="podium-name">({formatPlayerList(listTeamPlayer(top3[2]))})</span>
			</div>
		{/if}
	</div>

	{#if others.length > 0}
		<div class="others-list">
			{#each others as team, i}
				{@const stats = getTeamStats(team)}
				<div class="other-item">
					<span class="rank">{i + 4}</span>
					<span class="podium-name">{team.name}</span>
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
