<script lang="ts">
	import type { Competition } from '$lib/types/competitionType';
	import type { Regulations } from '$lib/types/regulationsType';
	import type { Fly } from '$lib/types/flyType';
	import { shuffle } from '$lib/utils/sharedFunction';

	import CompetitionMenu from './CompetitionMenu.svelte';
	import { regulationsStore } from '$lib/stores/championship/regulationsStore.svelte';
	import { onMount } from 'svelte';
	import { competitionStatus } from '$lib/stores/championship/competitionStatusStore.svelte';
	import { flysChampionshipStore } from '$lib/stores/championship/flysChampionshipStore.svelte';
	import { competitionsStore } from '$lib/stores/championship/competitionsStore.svelte';
	import { playersChampionshipStore } from '$lib/stores/championship/playersChampionshipStore.svelte';
	import { teamsChampionshipStore } from '$lib/stores/championship/teamsChampionshipStore.svelte';
	import Selector from '$lib/ui/Selector.svelte';

	let { currentCompetition = $bindable() } = $props<{
		currentCompetition: Competition | undefined;
	}>();

	let rules: Regulations | undefined = $state();
	let flys: Fly[] = $derived(
		flysChampionshipStore.list.filter((fly) => currentCompetition.flysId.includes(fly.id))
	);
	let newIdFly: string = $state('');

	const startCompetition = () => {
		//competitionStatus.status = 'in_progress';
		//competitionStatus.action = 'welcome';
	};

	const calculateFlys = () => {
		if (rules?.teamGame) calculateFlysTeam();
		else calculateFlysSolo();
	};

	const calculateFlysSolo = () => {
		const sortedPlayersId: string[] = shuffle(currentCompetition.playersId);
		const playersPerFly: number = rules?.playersPerFly || 6;
		let nbFlys: number = 0;
		let fly: Fly = {} as Fly;

		purgePreviousFlys();
		for (let i = 0; i < sortedPlayersId.length; i++) {
			if (i % playersPerFly === 0) {
				nbFlys += 1;
				fly = flysChampionshipStore.add(nbFlys);
				fly.playersId.push(sortedPlayersId[i]);
				currentCompetition.flysId.push(fly.id);
			} else fly.playersId.push(sortedPlayersId[i]);
		}
	};

	const calculateFlysTeam = () => {
		const sortedTeamsId: string[] = shuffle(currentCompetition.teamsId);
		const teamsPerFly: number = rules?.teamsPerFly || 6;
		let nbFlys: number = 0;
		let fly: Fly = {} as Fly;

		purgePreviousFlys();
		for (let i = 0; i < sortedTeamsId.length; i++) {
			if (i % teamsPerFly === 0) {
				nbFlys += 1;
				fly = flysChampionshipStore.add(nbFlys);
				fly.teamsId.push(sortedTeamsId[i]);
				currentCompetition.flysId.push(fly.id);
			} else fly.teamsId.push(sortedTeamsId[i]);
		}
	};

	const purgePreviousFlys = () => {
		currentCompetition.flysId.forEach((f: string) => {
			flysChampionshipStore.remove(f);
		});
		currentCompetition.flysId = [];
	};

	const updateTeamFly = (flyId: string, newflyId: string, teamId: string) => {
		const f = flysChampionshipStore;
		f.list.forEach((fly) => {
			if (fly.teamsId.includes(teamId)) {
				fly.teamsId = fly.teamsId.filter((id) => id !== teamId);
			}
		});
		f.find(newflyId)?.teamsId.push(teamId);
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

	<h2>Commencer la compétition</h2>
	<h3>Liste des flys</h3>

	{#if flys.length > 0}
		{#if rules?.teamGame}
			<!-- Compétition par équipe -->
			{@const flysId = flys.map((f) => f.id)}
			{@const flysOrder = flys.map((f) => 'Fly #' + f.order)}
			{#each flys as fly}
				<div class="fly">
					{fly.order}
					{#each fly.teamsId as teamId}
						{@const teamFly = teamsChampionshipStore.find(teamId)}
						<span class="team-in-fly">
							{teamFly?.name}
						</span>
						<Selector
							bind:value={newIdFly}
							options={flysId}
							optionsLabel={flysOrder}
							onchange={() => updateTeamFly(fly.id, newIdFly, teamId)}
						/>
					{/each}
				</div>
			{/each}
			<button onclick={() => calculateFlys()}>Recalculer les flys</button>
		{:else}
			<!-- Compétition individuelle -->
			{#each flys as fly}
				<div class="fly">
					{fly.order}
					{#each fly.playersId as playerId}
						{@const playerFly = playersChampionshipStore.find(playerId)}
						<div class="player-in-fly">
							{playerFly?.name}
						</div>
					{/each}
				</div>
			{/each}
			<button onclick={() => calculateFlys()}>Recalculer les flys</button>
		{/if}
	{:else}
		<p>Les flys ne sont pas définis</p>
		<button onclick={() => calculateFlys()}>Calculer les flys</button>
	{/if}
	<h3>Autoriser les modifications de fly</h3>
	<h3>Si les flys sont OK, lancer la compétition</h3>

	<button onclick={startCompetition} class="subnav"> Lancer la compétition </button>
	<p>Une fois la compétition lancée les flys ne peuvent etre modifié</p>
	<p>
		Au mieux des joueurs et équipes 'sans club' seront ajoutables par le responsable de la carte de
		score
	</p>
</div>

<style>
	.fly {
		background-color: var(--bg-card);
		margin-bottom: 10px;
		padding: 10px;
	}

	.player-in-fly {
		font-weight: bold;
	}
</style>
