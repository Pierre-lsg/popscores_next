<script lang="ts">
	import type { Competition } from '$lib/types/competitionType';
	import type { Fly } from '$lib/types/flyType';
	import type { Regulations } from '$lib/types/regulationsType';

	import CompetitionMenu from './CompetitionMenu.svelte';
	import { flysChampionshipStore } from '$lib/stores/championship/flysChampionshipStore.svelte';
	import { regulationsStore } from '$lib/stores/championship/regulationsStore.svelte';
	import { onMount } from 'svelte';

	let { currentCompetition = $bindable(), currentFly = $bindable() } = $props<{
		currentCompetition: Competition | undefined;
		currentFly: Fly | undefined;
	}>();

	let rules: Regulations | undefined = $state();

	let flys: Fly[] = $derived(
		flysChampionshipStore.list.filter((fly) => currentCompetition.flysId.includes(fly.id))
	);

	const validating = () => {
		// currentCompetition.status = 'finished';
		// currentCompetition.step = 'welcome';
	};

	const loadingFly = (fly: Fly) => {
		currentFly = fly;
	};

	onMount(() => {
		if (currentCompetition) {
			if (currentCompetition.regulationsId !== '')
				rules = regulationsStore.find(currentCompetition.regulationsId);
			if (!rules) {
				rules = regulationsStore.new();
				currentCompetition.regulationsId = rules.id;
			}
		}
		if (!currentCompetition.playersId) currentCompetition.playersId = [];
		if (!currentCompetition.teamsId) currentCompetition.teamsId = [];
		if (!currentCompetition.flysId) currentCompetition.flysId = [];
	});
</script>

<div>
	<CompetitionMenu bind:currentCompetition />
	<h2>Saisir les scores</h2>
	{#each flys as fly}
		<div role="none" class="fly" onclick={() => loadingFly(fly)}>
			<span>Fly{fly.order} </span>
			<span>{fly.status || 'inconnu'}</span>
		</div>
	{/each}

	<h3>Sélection par fly</h3>
	<p>Accès externe à cette fonctionnalité. Dans ce cas aucun menu et cadre limité</p>
	<p>Pour chaque trou du parcours</p>
	<p>Consultation à tout moment de la carte de score</p>
	<p>Un fly est comparé à une session du mode 'partie rapide'</p>
	<p>Si tout est saisi, demande de valider la carte avant de la transmettre</p>

	<h3>En organisateur</h3>
	<p>Lister l'ensemble des flys et afficher la carte de score</p>
	<p>Permettre d'import de carte depuis le Cloud</p>
	<p>Controle de l'état de chaque carte</p>
	<p>Si toutes les cartes validées par les responsables de fly</p>
	<p>--> Validation de la compétition</p>

	<button onclick={validating} class="subnav"> Valider l'ensemble des cartes </button>
</div>

<style>
	.fly {
		background-color: var(--bg-card);
		margin-bottom: 10px;
		padding: 10px;
	}
</style>
