<script lang="ts">
	import { playersStore } from '$lib/stores/playersStore';
	import { holesStore } from '$lib/stores/holesStore';
	import { gameStatus, currentHoleIndex } from '$lib/stores/gameStatusStore';
	import { onMount } from 'svelte';
	import { shareService } from '$lib/utils/shareService';
	import { showToast } from '$lib/stores/toastStore';
	import { archiveGame } from '$lib/stores/historyStore';

	import Toast from '$lib/ui/Toast.svelte';
	import GolfHeader from '$lib/ui/GolfHeader.svelte';

	import RankingPodium from '$lib/components/RankingPodium.svelte';
	import GolfMSession from '$lib/components/GolfMSession.svelte';
	import GolfMPlayer from '$lib/components/GolfMPlayer.svelte';
	import GolfMHoles from '$lib/components/GolfMHoles.svelte';
	import GolfMScoring from '$lib/components/GolfMScoring.svelte';

	const Step = { session: 1, players: 2, holes: 3, scoring: 4, ranking: 5 };

	let currentStep: number = 1;
	let activeHoleIndex = $currentHoleIndex || 0;

	let locationName = '';
	let weatherCondition = 'Soleil';

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

		if ($gameStatus === 'setup') nextCard(Step.session);
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
			onNext={() => nextCard(Step.holes)}
			onPrev={() => nextCard(Step.session)}
		/>
		<GolfMPlayer {holeCount} />

		<!-- Saisie du parcours : trous, par, ... -->
	{:else if currentStep === Step.holes}
		<GolfHeader
			title="⛳ Saisie du parcours"
			onNext={() => nextCard(Step.scoring)}
			onPrev={() => nextCard(Step.players)}
		/>
		<GolfMHoles />

		<!-- Saisie du score lors du parcours -->
	{:else if currentStep === Step.scoring}
		<GolfHeader
			title="📝 Saisie des scores"
			onNext={() => nextCard(Step.ranking)}
			onPrev={() => nextCard(Step.holes)}
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

	.btn {
		width: 100%;
		-webkit-tap-highlight-color: transparent;
		user-select: none;
	}
</style>
