<script lang="ts">
	import { playersStore } from '$lib/stores/playersStore.svelte';
	import { targetsStore } from '$lib/stores/targetsStore.svelte';
	import { gameStatus } from '$lib/stores/gameStatusStore.svelte';
	import { onMount } from 'svelte';
	import { shareService } from '$lib/utils/shareService';
	import { toastStore } from '$lib/stores/toastStore.svelte';


    import HistoryList from '$lib/components/history/HistoryList.svelte';
    import SessionDetails from '$lib/components/history/SessionDetails.svelte';
    import SessionPodium from '$lib/components/history/SessionPodium.svelte';
    import SessionScoreCard from '$lib/components/history/SessionScoreCard.svelte';

	const Step = { list: 1, details: 2, podium: 3, scoreCard: 4};

	let currentStep: number = $state(1);

	let activeTargetIndex = gameStatus.currentTargetIndex || 0;

	gameStatus.currentTargetIndex = activeTargetIndex;

	onMount(() => {
		const importedData = shareService.loadFromUrl();
	});

	function nextCard(nextStep: number) {
		currentStep = nextStep;
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
	<!-- Liste des sessions historisées en local -->
	{#if currentStep === Step.list}
		<HistoryList
			title="👥 Liste des sessions passées"
		/>

		<!-- Details de la session	 -->
	{:else if currentStep === Step.details}

		<!-- Résultat de la Partie : classement final -->
	{:else if currentStep === Step.list}

		<button class="btn btn-primary" onclick={() => nextCard(Step.scoreCard)}>Carte de score</button>
		<button onclick={copyShareLink} class="btn btn-share"> 🔗 Partager la partie </button>
	{/if}
</div>

<style>
	.mobile-wizard {
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.btn {
		width: 100%;
		-webkit-tap-highlight-color: transparent;
		user-select: none;
	}
</style>
