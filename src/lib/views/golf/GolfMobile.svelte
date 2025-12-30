<script lang="ts">
	import type { Player } from '$lib/types/types';

	import Stepper from '$lib/ui/Stepper.svelte';

	import { playersStore } from '$lib/stores/playersStore';
	import { holesStore } from '$lib/stores/holesStore';
	import { slide } from 'svelte/transition';
	import { gameStatus, currentHoleIndex } from '$lib/stores/gameStatusStore';
	import { onMount } from 'svelte';
	import { shareService } from '$lib/utils/shareService';
	import { showToast } from '$lib/stores/toastStore';

	import Toast from '$lib/ui/Toast.svelte';
	import RankingPodium from '$lib/components/RankingPodium.svelte';
	import { archiveGame } from '$lib/stores/historyStore';
	import GolfMSession from '$lib/components/GolfMSession.svelte';
	import GolfMPlayer from '$lib/components/GolfMPlayer.svelte';

	let currentStep: 'session' | 'players' | 'holes' | 'scoring' | 'ranking' = 'session';
	let activeHoleIndex = $currentHoleIndex || 0;
	let step = 1;

	let locationName = '';
	let weatherCondition = 'Soleil';

	const weatherOptions = ['Soleil', 'Nuageux', 'Pluie', 'Venté', 'Froid'];

	$: currentHole = $holesStore[activeHoleIndex];
	$: isFirstHole = activeHoleIndex === 0;
	$: isLastHole = activeHoleIndex === $holesStore.length - 1;

	$: players = $playersStore;
	$: holes = $holesStore;
	$: holeCount = holes.length;
	$: currentHoleIndex.set(activeHoleIndex);

	onMount(() => {
		const importedData = shareService.loadFromUrl();
		if (importedData) {
			if (confirm('Une partie a été trouvée via ce lien. Voulez-vous charger les scores ?')) {
				playersStore.set(importedData.players);
				holesStore.set(importedData.holes);
				// Nettoyer l'URL pour éviter de re-proposer l'import au prochain refresh
				window.history.replaceState({}, '', window.location.pathname);
			}
		}

		if ($gameStatus === 'setup') nextCard('players');
		else if ($gameStatus === 'in_progress') nextCard('scoring');
		else if ($gameStatus === 'finished') nextCard('ranking');
	});

	function nextCard(nextStep: 'session' | 'players' | 'holes' | 'scoring' | 'ranking') {
		currentStep = nextStep;
		if (nextStep === 'session') {
			step = 1;
			gameStatus.set('setup');
		} else if (nextStep === 'players') {
			step = 2;
			gameStatus.set('setup');
		} else if (nextStep === 'holes') {
			step = 3;
			gameStatus.set('setup');
		} else if (nextStep === 'scoring') {
			step = 4;
			gameStatus.set('in_progress');
		} else if (nextStep === 'ranking') {
			step = 5;
			gameStatus.set('finished');
		}
	}

	function addHole() {
		holesStore.add();
		// à améliorer
		playersStore.syncAddHole(4);
	}

	function confirmDeleteHole(index: number) {
		if (confirm(`Supprimer le trou n°${index + 1} ?`)) {
			// On appelle les deux stores pour rester synchronisé
			holesStore.remove(index);
			playersStore.syncRemoveHole(index);
		}
	}

	function resetGame() {
		if (confirm('Voulez-vous vraiment recommencer à zéro ?')) {
			playersStore.reset();
			holesStore.reset();
			nextCard('session');
		}
	}

	function saveGameToHistory() {
		const newArchive = {
			id: crypto.randomUUID(), // Identifiant unique
			date: new Date().toISOString(),
			location: locationName,
			weather: weatherCondition,
			players: $playersStore, // On fige l'état des joueurs et scores
			holes: $holesStore,
			totalPar: $holesStore.reduce((sum, h) => sum + h.par, 0)
		};

		archiveGame(newArchive);
	}

	async function copyShareLink() {
		try {
			const link = shareService.generateLink($playersStore, $holesStore);
			await navigator.clipboard.writeText(link);

			// On déclenche le toast !
			showToast('🔗 Lien de partage copié !');
		} catch (err) {
			showToast('❌ Erreur lors de la copie');
		}
	}
</script>

<div class="mobile-wizard">
	<div class="progress-bar">
		<div class="fill" style="width: {step * 20}%"></div>
	</div>

	<!-- Saisie des inforamtions de la partie -->
	{#if currentStep === 'session'}
		<GolfMSession />
		<button on:click={() => nextCard('players')} class="btn btn-next">Suivant : Les joueurs</button>

		<!-- Saisie des joueurs de la partie -->
	{:else if currentStep === 'players'}
		<GolfMPlayer {holeCount} />
		<button on:click={() => nextCard('session')} class="btn btn-prev">Retour : La session</button>
		<button on:click={() => nextCard('holes')} class="btn btn-next">Suivant : Le parcours</button>

		<!-- Saisie du parcours : trous, par, ... -->
	{:else if currentStep === 'holes'}
		<div class="step-content" in:slide>
			<h2>⛳ Réglage des PARs</h2>
			<button on:click={addHole} class="btn btn-primary">Ajouter un Trou</button>
			<table>
				<thead>
					<tr class="par-row">
						<th class="sticky-col"><strong>Joueurs</strong></th>
						<th class="action-header">Action</th>
					</tr>
				</thead>
				<tbody>
					{#each $holesStore as hole, i}
						<tr class="scroll-area">
							<td>
								<Stepper label="Trou {i + 1}" bind:value={hole.par} min={3} />
							</td>
							<td>
								<button class="btn-delete" on:click={() => confirmDeleteHole(i)}> &times; </button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>

			<div class="actions">
				<button on:click={() => nextCard('players')} class="btn btn-prev"
					>Retour : Les joueurs</button
				>
				<button on:click={() => nextCard('scoring')} class="btn btn-next"
					>Commencer la partie</button
				>
			</div>
		</div>

		<!-- Saisie du score lors du parcours -->
	{:else if currentStep === 'scoring'}
		<div class="step-content" in:slide>
			<header class="hole-header">
				<button on:click={() => activeHoleIndex--} disabled={isFirstHole}>◀</button>
				<div class="hole-info">
					<h3>Trou {activeHoleIndex + 1}</h3>
					<span class="par-badge">PAR {currentHole.par}</span>
				</div>
				<button on:click={() => activeHoleIndex++} disabled={isLastHole}>▶</button>
			</header>

			<div class="scores-grid">
				{#each $playersStore as player}
					<div class="score-row">
						<span class="player-name">{player.name}</span>
						<Stepper bind:value={player.scores[activeHoleIndex]} min={1} />
					</div>
				{/each}
			</div>

			<div class="footer-actions">
				<button on:click={() => nextCard('holes')} class="btn btn-prev">Retour : Les trous</button>
				<button on:click={() => nextCard('ranking')} class="btn btn-next">Classement final</button>
			</div>
		</div>

		<!-- Résultat de la Partie : classement final -->
	{:else if currentStep === 'ranking'}
		<div class="step-content" in:slide>
			<h2>🏆 Classement Final</h2>

			<RankingPodium />

			<button class="btn btn-prev" on:click={() => nextCard('scoring')}>Retour aux scores</button>
			<button on:click={copyShareLink} class="btn btn-share"> 🔗 Partager la partie </button>
			<button class="btn btn-primary" on:click={() => resetGame()}>Nouvelle partie</button>
			<button class="btn btn-primary" on:click={() => saveGameToHistory()}
				>Sauvegarder la partie</button
			>
		</div>

		<Toast />
	{/if}
</div>

<style>
	.mobile-wizard {
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.progress-bar {
		height: 4px;
		background: #eee;
		border-radius: 2px;
	}
	.fill {
		height: 100%;
		background: var(--primary);
		transition: width 0.3s;
	}

	.step-content {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.hole-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: var(--bg-card);
		padding: 1rem;
		border-radius: 12px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.par-badge {
		background: var(--primary-light);
		color: var(--primary);
		padding: 2px 8px;
		border-radius: 4px;
		font-weight: bold;
	}

	.score-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: var(--bg-card);
		padding: 0.8rem;
		border-radius: 8px;
		margin-bottom: 0.5rem;
		border: 1px solid var(--border-color);
	}

	.player-name {
		font-weight: 600;
		font-size: 1.1rem;
	}

	.btn-next {
		background-color: blue;
		color: #eee;
		border: none;
		padding: 1rem;
		margin: 0.5rem 0;
		border-radius: 12px;
		font-weight: bold;
		font-size: 1.1rem;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}

	.btn-next:active {
		transform: scale(0.98);
	}

	.btn-prev {
		background-color: gray;
	}

	/* Scroll fluide pour la liste des trous si le parcours est long */
	.scroll-area {
		max-height: 60vh;
		overflow-y: auto;
		padding-right: 5px;
	}

	.btn {
		width: 100%;
		-webkit-tap-highlight-color: transparent;
		user-select: none;
	}
</style>
