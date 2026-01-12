<script lang="ts">
	import { playersStore } from '$lib/stores/playersStore.svelte';
	import { targetsStore } from '$lib/stores/targetsStore.svelte';
	import { teamsStore } from '$lib/stores/teamsStore.svelte';
	import { gameStatus } from '$lib/stores/gameStatusStore.svelte';
	import { onMount } from 'svelte';
	import { shareService } from '$lib/utils/shareService';
	import { toastStore } from '$lib/stores/toastStore.svelte';
	import { historyStore } from '$lib/stores/historyStore.svelte';

	import Toast from '$lib/ui/Toast.svelte';
	import GolfHeader from '$lib/ui/GolfHeader.svelte';

	import RankingPodium from '$lib/components/streetGolfSession/RankingPodium.svelte';
	import GolfMSession from '$lib/components/streetGolfSession/GolfMSession.svelte';
	import GolfMPlayer from '$lib/components/streetGolfSession/GolfMPlayer.svelte';
	import GolfMTargets from '$lib/components/streetGolfSession/GolfMTargets.svelte';
	import GolfMScoring from '$lib/components/streetGolfSession/GolfMScoring.svelte';
	import ScoreCard from '$lib/components/streetGolfSession/ScoreCard.svelte';
	import { sessionSettingsStore } from '$lib/stores/gameSessionStore.svelte';

	const Step = { session: 1, players: 2, targets: 3, scoring: 4, ranking: 5, scoreCard: 51 };

	let currentStep: number = $state(1);

	let activeTargetIndex = gameStatus.currentTargetIndex || 0;

	let locationName = '';
	let weatherCondition = 'Soleil';

	let targets = $derived(targetsStore.list);

	gameStatus.currentTargetIndex = activeTargetIndex;

	onMount(() => {
		const importedData = shareService.loadFromUrl();
		if (importedData) {
			if (confirm('Une partie a été trouvée via ce lien. Voulez-vous charger les scores ?')) {
				playersStore.list = importedData.players;
				targetsStore.list = importedData.targets;
				window.history.replaceState({}, '', window.location.pathname);
			}
		}

		if (gameStatus.status === 'setup') nextCard(Step.session);
		else if (gameStatus.status === 'in_progress') nextCard(Step.scoring);
		else if (gameStatus.status === 'finished') nextCard(Step.ranking);
	});

	function nextCard(nextStep: number) {
		currentStep = nextStep;
		if (nextStep === Step.session) gameStatus.status = 'setup';
		else if (nextStep === Step.players) gameStatus.status = 'setup';
		else if (nextStep === Step.targets) gameStatus.status = 'setup';
		else if (nextStep === Step.scoring) gameStatus.status = 'in_progress';
		else if (nextStep === Step.ranking) gameStatus.status = 'finished';
	}

	function resetGame() {
		if (confirm('Voulez-vous vraiment recommencer à zéro ?')) {
			playersStore.reset();
			targetsStore.reset();
			teamsStore.reset();
			activeTargetIndex = 0;
			nextCard(Step.session);
		}
	}

	function saveGameToHistory() {
		const newArchive = {
			id: crypto.randomUUID(), 
			settings: sessionSettingsStore.settings,
			targets: targetsStore.list,
			teams: teamsStore.list,
			players: playersStore.list,
		};

		historyStore.archiveGame(newArchive);
	}

	async function copyShareLink() {
		try {
			const link = shareService.generateLink(playersStore.list, targetsStore.list);
			await navigator.clipboard.writeText(link);

			// On déclenche le toast !
			toastStore.show('🔗 Lien de partage copié !');
		} catch (err) {
			toastStore.show('❌ Erreur lors de la copie');
		}
	}
</script>

<div class="mobile-wizard">
	{#if currentStep < 10}
		<div class="progress-bar">
			<div class="fill" style="width: {currentStep * 20}%"></div>
		</div>
	{/if}

	<!-- Saisie des inforamtions de la partie -->
	{#if currentStep === Step.session}
		<GolfHeader
			title="⚙️ Params de la session"
			onNext={() => nextCard(Step.players)}
			onPrev={() => undefined}
		/>
		<GolfMSession />

		<!-- Saisie des joueurs de la partie -->
	{:else if currentStep === Step.players}
		<GolfHeader
			title="👥 Saisie des joueurs"
			onNext={() => nextCard(Step.targets)}
			onPrev={() => nextCard(Step.session)}
		/>
		<GolfMPlayer />

		<!-- Saisie du parcours : trous, par, ... -->
	{:else if currentStep === Step.targets}
		<GolfHeader
			title="⛳ Saisie du parcours"
			onNext={() => nextCard(Step.scoring)}
			onPrev={() => nextCard(Step.players)}
		/>
		<GolfMTargets />

		<!-- Saisie du score lors du parcours -->
	{:else if currentStep === Step.scoring}
		<GolfHeader
			title="📝 Saisie des scores"
			onNext={() => nextCard(Step.ranking)}
			onPrev={() => nextCard(Step.targets)}
		/>
		<GolfMScoring />

		<!-- Résultat de la Partie : classement final -->
	{:else if currentStep === Step.ranking}
		<GolfHeader
			title="🏆 Classement Final"
			onNext={() => undefined}
			onPrev={() => nextCard(Step.scoring)}
		/>
		<RankingPodium />

		<button class="btn btn-primary" onclick={() => nextCard(Step.scoreCard)}>Carte de score</button>
		<button onclick={copyShareLink} class="btn btn-share"> 🔗 Partager la partie </button>
		<button class="btn btn-primary" onclick={() => resetGame()}>Nouvelle partie</button>
		<button class="btn btn-primary" onclick={() => saveGameToHistory()}
			>Sauvegarder la partie</button
		>

		<!-- Résultat de la Partie : carte de score -->
	{:else if currentStep === Step.scoreCard}
		<GolfHeader
			title="🏆 Carte de score"
			onNext={() => undefined}
			onPrev={() => nextCard(Step.ranking)}
		/>
		<ScoreCard />

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

	.btn {
		width: 100%;
		-webkit-tap-highlight-color: transparent;
		user-select: none;
	}
</style>
