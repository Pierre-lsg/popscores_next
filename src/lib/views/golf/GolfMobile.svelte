<script lang="ts">
	import Stepper from '$lib/ui/Stepper.svelte';

	import { playersStore } from '$lib/stores/playersStore';
	import { holesStore } from '$lib/stores/holesStore';
	import { gameStatus, currentHoleIndex } from '$lib/stores/gameStatusStore';
	import { onMount } from 'svelte';
	import { shareService } from '$lib/utils/shareService';
	import { showToast } from '$lib/stores/toastStore';
	import { archiveGame } from '$lib/stores/historyStore';

	import Toast from '$lib/ui/Toast.svelte';
	import RankingPodium from '$lib/components/RankingPodium.svelte';
	import GolfMSession from '$lib/components/GolfMSession.svelte';
	import GolfMPlayer from '$lib/components/GolfMPlayer.svelte';
	import GolfMHoles from '$lib/components/GolfMHoles.svelte';
	import GolfMScoring from '$lib/components/GolfMScoring.svelte';

	const Step = { session: 1, players: 2, holes: 3, scoring: 4, ranking: 5 };

	let currentStep = Step.session;
	let activeHoleIndex = $currentHoleIndex || 0;

	let locationName = '';
	let weatherCondition = 'Soleil';

	const weatherOptions = ['Soleil', 'Nuageux', 'Pluie', 'Venté', 'Froid'];

	$: holes = $holesStore;
	$: holeCount = holes.length;
	$: currentHoleIndex.set(activeHoleIndex);

	onMount(() => {
		const importedData = shareService.loadFromUrl();
		if (importedData) {
			if (confirm('Une partie a été trouvée via ce lien. Voulez-vous charger les scores ?')) {
				playersStore.set(importedData.players);
				holesStore.set(importedData.holes);
				window.history.replaceState({}, '', window.location.pathname);
			}
		}

		if ($gameStatus === 'setup') nextCard(Step.players);
		else if ($gameStatus === 'in_progress') nextCard(Step.scoring);
		else if ($gameStatus === 'finished') nextCard(Step.ranking);
	});

	function nextCard(nextStep: number) {
		currentStep = nextStep;
		if (nextStep === Step.session) gameStatus.set('setup');
		else if (nextStep === Step.players) gameStatus.set('setup');
		else if (nextStep === Step.holes) gameStatus.set('setup');
		else if (nextStep === Step.scoring) gameStatus.set('in_progress');
		else if (nextStep === Step.ranking) gameStatus.set('finished');
	}

	function resetGame() {
		if (confirm('Voulez-vous vraiment recommencer à zéro ?')) {
			playersStore.reset();
			holesStore.reset();
			activeHoleIndex = 0;
			nextCard(Step.session);
		}
	}

	function saveGameToHistory() {
		const newArchive = {
			id: crypto.randomUUID(), // Identifiant unique
			date: new Date().toISOString(),
			location: locationName,
			weather: weatherCondition,
			players: $playersStore,
			holes: $holesStore
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
		<div class="fill" style="width: {currentStep * 20}%"></div>
	</div>

	<!-- Saisie des inforamtions de la partie -->
	{#if currentStep === Step.session}
		<GolfMSession />
		<button on:click={() => nextCard(Step.players)} class="btn btn-next"
			>Suivant : Les joueurs</button
		>

		<!-- Saisie des joueurs de la partie -->
	{:else if currentStep === Step.players}
		<GolfMPlayer {holeCount} />
		<button on:click={() => nextCard(Step.session)} class="btn btn-prev">Retour : La session</button
		>
		<button on:click={() => nextCard(Step.holes)} class="btn btn-next">Suivant : Le parcours</button
		>

		<!-- Saisie du parcours : trous, par, ... -->
	{:else if currentStep === Step.holes}
		<GolfMHoles />
		<button on:click={() => nextCard(Step.players)} class="btn btn-prev"
			>Retour : Les joueurs</button
		>
		<button on:click={() => nextCard(Step.scoring)} class="btn btn-next">Commencer la partie</button
		>

		<!-- Saisie du score lors du parcours -->
	{:else if currentStep === Step.scoring}
		<GolfMScoring />
		<button on:click={() => nextCard(Step.holes)} class="btn btn-prev">Retour : Les trous</button>
		<button on:click={() => nextCard(Step.ranking)} class="btn btn-next">Classement final</button>

		<!-- Résultat de la Partie : classement final -->
	{:else if currentStep === Step.ranking}
		<h2>🏆 Classement Final</h2>

		<RankingPodium />

		<button class="btn btn-prev" on:click={() => nextCard(Step.scoring)}>Retour aux scores</button>
		<button on:click={copyShareLink} class="btn btn-share"> 🔗 Partager la partie </button>
		<button class="btn btn-primary" on:click={() => resetGame()}>Nouvelle partie</button>
		<button class="btn btn-primary" on:click={() => saveGameToHistory()}
			>Sauvegarder la partie</button
		>

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
