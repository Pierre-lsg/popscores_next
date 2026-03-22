<script lang="ts">
	import { playersStore } from '$lib/stores/quickSession/playersStore.svelte';
	import { targetsStore } from '$lib/stores/quickSession/targetsStore.svelte';
	import { teamsStore } from '$lib/stores/quickSession/teamsStore.svelte';
	import { gameStatus } from '$lib/stores/gameStatusStore.svelte';

	import { onMount } from 'svelte';
	import { afterNavigate } from '$app/navigation';

	import { shareService } from '$lib/utils/shareService';
	import { toastStore } from '$lib/stores/toastStore.svelte';
	import { historyStore } from '$lib/stores/quickSession/historyStore.svelte';

	import Toast from '$lib/ui/Toast.svelte';
	import GolfHeader from '$lib/ui/GolfHeader.svelte';
	import type { Course } from '$lib/types/courseType';

	import RankingPodium from '$lib/components/quickSession/RankingPodium.svelte';
	import GolfMSession from '$lib/components/quickSession/GolfMSession.svelte';
	import GolfMPlayer from '$lib/components/quickSession/GolfMPlayer.svelte';
	import GolfMTargets from '$lib/components/quickSession/GolfMTargets.svelte';
	import GolfMScoring from '$lib/components/quickSession/GolfMScoring.svelte';
	import ScoreCard from '$lib/components/quickSession/ScoreCard.svelte';
	import { sessionSettingsStore } from '$lib/stores/gameSessionStore.svelte';
	import { coursesStore } from '$lib/stores/quickSession/coursesStore.svelte';

	const Step = { session: 1, players: 2, targets: 3, scoring: 4, ranking: 5, scoreCard: 51 };

	let currentStep: number = $state(1);
	let activeTargetIndex = gameStatus.currentTargetIndex || 0;

	let isSessionHistorised: boolean = $state(false);
	let isCourseSaved: boolean = $state(false);

	gameStatus.currentTargetIndex = activeTargetIndex;

	afterNavigate(({ type }) => {
		if (type === 'link') {
			if (gameStatus.status !== 'setup') {
				if (confirm('Une partie est déjà en cours. Voulez-vous commencer une nouvelle partie ?')) {
					resetGame();
				}
			}
		}
	});

	onMount(() => {
		/*const importedData = shareService.loadFromUrl();
		if (importedData) {
			if (confirm('Une partie a été trouvée via ce lien. Voulez-vous charger les scores ?')) {
				playersStore.list = importedData.players;
				targetsStore.list = importedData.targets;
				window.history.replaceState({}, '', window.location.pathname);
			}
		}*/
		isSessionHistorised = historyStore.isGameHistorized(sessionSettingsStore.settings.id);
		isCourseSaved = coursesStore.isCourseExisted(sessionSettingsStore.settings.id);

		if (gameStatus.status === 'setup') nextCard(Step.session);
		else if (gameStatus.status === 'in_progress') nextCard(Step.scoring);
		else if (gameStatus.status === 'finished') nextCard(Step.ranking);
	});

	const nextCard = (nextStep: number) => {
		currentStep = nextStep;
		if (nextStep === Step.session) gameStatus.status = 'setup';
		else if (nextStep === Step.players) gameStatus.status = 'setup';
		else if (nextStep === Step.targets) gameStatus.status = 'setup';
		else if (nextStep === Step.scoring) gameStatus.status = 'in_progress';
		else if (nextStep === Step.ranking) gameStatus.status = 'finished';
	};

	const resetGameConfirm = () => {
		if (confirm('Voulez-vous vraiment recommencer à zéro ?')) {
			resetGame();
		}
	};

	const resetGame = () => {
		playersStore.reset();
		targetsStore.reset();
		teamsStore.reset();
		sessionSettingsStore.reset();
		gameStatus.reset();
		activeTargetIndex = 0;
		isSessionHistorised = false;
		nextCard(Step.session);
	};

	const saveGameToHistory = () => {
		const newArchive = {
			id: sessionSettingsStore.settings.id,
			settings: sessionSettingsStore.settings,
			targets: targetsStore.list,
			teams: teamsStore.list,
			players: playersStore.list
		};

		isSessionHistorised = historyStore.archiveGame(newArchive);
		if (isSessionHistorised) toastStore.show("Session enregistrée dans l'historique");
	};

	const saveCourse = () => {
		const newCourse: Course = {
			id: sessionSettingsStore.settings.id,
			name:
				sessionSettingsStore.settings.locationName +
				' (' +
				sessionSettingsStore.settings.sessionBeginning +
				')',
			targets: targetsStore.list
		};

		coursesStore.load(newCourse);
		toastStore.show('Parcours enregistré ...');
		isCourseSaved = true;
	};

	const showPodium = () => {
		// All scores have been entered ?
		let hasAllScoresEntered = true;
		targetsStore.list.forEach((t) => {
			const playersScore = playersStore.getPlayersScore(t.id);

			if (playersScore.length === playersStore.list.length) {
				for (const ps of playersScore) {
					if (ps.score === null || ps.score === undefined) {
						hasAllScoresEntered = false;
					}
				}
			} else hasAllScoresEntered = false;
		});

		if (hasAllScoresEntered) nextCard(Step.ranking);
		else {
			if (confirm("Tous les scores n'ont pas été saisis.\nVoulez-vous accéder au Podium ?"))
				nextCard(Step.ranking);
		}
	};

	const showTargets = () => {
		if (playersStore.list.length > 0) nextCard(Step.targets);
		else alert('Veuillez saisir un joueur');
	};

	const showScoring = () => {
		if (targetsStore.list.length) nextCard(Step.scoring);
		else alert('Veuillez saisir une cible');
	};

	const copyShareLink = async () => {
		try {
			const link = shareService.generateLink(playersStore.list, targetsStore.list);
			await navigator.clipboard.writeText(link);

			// On déclenche le toast !
			toastStore.show('🔗 Lien de partage copié !');
		} catch (err) {
			toastStore.show('❌ Erreur lors de la copie');
		}
	};
</script>

<div class="mobile-wizard">
	{#if currentStep < 10}
		<div class="progress-bar">
			<div class="fill" style="width: {currentStep * 20}%"></div>
		</div>
	{/if}

	<!-- Saisie des inforamtions de la partie -->
	{#if currentStep === Step.session}
		<GolfHeader title="⚙️ Params de la session" onNext={() => nextCard(Step.players)} />
		<GolfMSession />

		<!-- Saisie des joueurs de la partie -->
	{:else if currentStep === Step.players}
		<GolfHeader
			title="👥 Saisie des joueurs"
			onNext={() => showTargets()}
			onPrev={() => nextCard(Step.session)}
		/>
		<GolfMPlayer />

		<!-- Saisie du parcours : cibles, par, ... -->
	{:else if currentStep === Step.targets}
		<GolfHeader
			title="⛳ Saisie du parcours"
			onNext={() => showScoring()}
			onPrev={() => nextCard(Step.players)}
		/>
		<GolfMTargets />

		<!-- Saisie du score lors du parcours -->
	{:else if currentStep === Step.scoring}
		<GolfHeader
			title="📝 Saisie des scores"
			onNext={() => showPodium()}
			onPrev={() => nextCard(Step.targets)}
		/>
		<GolfMScoring />

		<!-- Résultat de la Partie : classement final -->
	{:else if currentStep === Step.ranking}
		<GolfHeader title="🏆 Classement Final" onPrev={() => nextCard(Step.scoring)} />
		<RankingPodium />

		<button class="btn btn-primary" onclick={() => nextCard(Step.scoreCard)}>Carte de score</button>
		<!-- <button onclick={copyShareLink} class="btn btn-share"> 🔗 Partager la partie </button> -->
		<button class="btn btn-primary" onclick={() => resetGameConfirm()}>Nouvelle partie</button>
		{#if !isSessionHistorised}
			<button class="btn btn-primary" onclick={() => saveGameToHistory()}
				>Historiser la partie</button
			>
		{/if}
		{#if !isCourseSaved}
			<button class="btn btn-primary" onclick={() => saveCourse()}>Enregistrer le parcours</button>
		{/if}

		<!-- Résultat de la Partie : carte de score -->
	{:else if currentStep === Step.scoreCard}
		<GolfHeader title="🏆 Carte de score" onPrev={() => nextCard(Step.ranking)} />
		<ScoreCard />

		<Toast />
	{/if}
</div>
