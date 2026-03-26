<script lang="ts">
	import type { Competition } from '$lib/types/competitionType';
	import type { Regulations } from '$lib/types/regulationsType';
	import type { Championship } from '$lib/types/championshipType';
	import type { Fly } from '$lib/types/flyType';
	import type { User } from '$lib/types/userType';

	import { shuffle } from '$lib/utils/sharedFunction';
	import { getSupervisors } from '$lib/utils/championship/championshipFunctions.svelte';
	import { startCompetition } from '$lib/utils/championship/competitionsFunctions.svelte';

	import CompetitionMenu from './CompetitionMenu.svelte';
	import Selector from '$lib/ui/Selector.svelte';

	import { getRules } from '$lib/utils/championship/competitionsFunctions.svelte';
	import { flysChampionshipStore } from '$lib/stores/championship/flysChampionshipStore.svelte';
	import { playersChampionshipStore } from '$lib/stores/championship/playersChampionshipStore.svelte';
	import { teamsCompetitionStore } from '$lib/stores/championship/teamsCompetitionStore.svelte';
	import { coursesChampionshipStore } from '$lib/stores/championship/coursesChampionshipStore.svelte';
	import { onMount } from 'svelte';
	import CompetitionSummaryBox from './CompetitionSummaryBox.svelte';

	let { currentCompetition = $bindable(), championship = $bindable() } = $props<{
		currentCompetition: Competition | undefined;
		championship: Championship;
	}>();

	let rules: Regulations = $state(getRules(currentCompetition));
	let nbTeamsPerFly: number = $derived(rules?.teamsPerFly || 3);
	let nbPlayersPerFly: number = $derived(rules?.playersPerFly || 6);
	let flys: Fly[] = $derived(
		flysChampionshipStore.list.filter((fly) => currentCompetition.flysId.includes(fly.id))
	);
	let courseCompetition = $derived(coursesChampionshipStore.find(currentCompetition.courseId));
	let newIdFly: string = $state('');
	let editingFly: boolean[] = $state([]);

	let supervisors: User[] = $state([]);
	let isAttachingSupervisor: boolean[] = $state([]);
	let showBox: boolean = $state(false);

	const start = async () => {
		startCompetition(currentCompetition, championship);
	};

	const calculateFlys = () => {
		if (rules?.regulation.teamGame) calculateFlysTeam();
		else calculateFlysSolo();
	};

	const calculateFlysSolo = () => {
		const sortedPlayersId: string[] = shuffle(currentCompetition.playersId);
		let nbFlys: number = 0;
		let fly: Fly = {} as Fly;

		purgePreviousFlys();
		for (let i = 0; i < sortedPlayersId.length; i++) {
			if (i % nbPlayersPerFly === 0) {
				nbFlys += 1;
				fly = flysChampionshipStore.add(nbFlys, currentCompetition.id);
				fly.playersId.push(sortedPlayersId[i]);
				currentCompetition.flysId.push(fly.id);
			} else fly.playersId.push(sortedPlayersId[i]);
		}
	};

	const calculateFlysTeam = () => {
		const sortedTeamsId: string[] = shuffle(currentCompetition.teamsId);
		let nbFlys: number = 0;
		let fly: Fly = {} as Fly;

		purgePreviousFlys();
		for (let i = 0; i < sortedTeamsId.length; i++) {
			if (i % nbTeamsPerFly === 0) {
				nbFlys += 1;
				fly = flysChampionshipStore.add(nbFlys, currentCompetition.id);
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

	const editTeamFly = (flyIdx: number, teamIdx: number) => {
		let idx: number = flyIdx * nbTeamsPerFly + teamIdx;
		for (let i = 0; i < editingFly.length; i++) {
			if (i !== idx) editingFly[i] = false;
		}
		editingFly[idx] = !editingFly[idx];
	};

	const updatePlayerFly = (flyId: string, newflyId: string, playerId: string) => {
		const f = flysChampionshipStore;
		f.list.forEach((fly) => {
			if (fly.playersId.includes(playerId)) {
				fly.playersId = fly.playersId.filter((id) => id !== playerId);
			}
		});
		f.find(newflyId)?.playersId.push(playerId);
	};

	const editPlayerFly = (flyIdx: number, playerIdx: number) => {
		let idx: number = flyIdx * nbPlayersPerFly + playerIdx;
		for (let i = 0; i < editingFly.length; i++) {
			if (i !== idx) editingFly[i] = false;
		}
		editingFly[idx] = !editingFly[idx];
	};

	const displaySupervisor = (fly: Fly) => {
		let supervisor = supervisors.find((s) => s.id === fly.supervisorId);
		if (supervisor) return supervisor.name;
		else return '((arbitre à définir))';
	};

	onMount(async () => {
		supervisors = await getSupervisors(championship);
	});
</script>

<svelte:window
	onclick={(e) => {
		// Si le menu de recherche de marshall est ouvert, le fermer

		if (isAttachingSupervisor.some((value) => value === true)) {
			if (e.target && !(e.target as Element).closest('.supervisor-wrapper')) {
				isAttachingSupervisor.fill(false);
			}
		}
	}}
/>

{#snippet addSupervisor(fly: Fly, i: number)}
	<div class="supervisor-wrapper">
		<div class="action">
			<button onclick={() => (isAttachingSupervisor[i] = !isAttachingSupervisor[i])}> 🌟 </button>
			{displaySupervisor(fly)}
		</div>
		{#if isAttachingSupervisor[i]}
			<Selector
				id="sheriff{i}"
				bind:value={fly.supervisorId}
				label="Liste des sheriffs"
				options={supervisors.map((s) => s.id)}
				optionsLabel={supervisors.map((s) => s.name)}
				unselectedOption="-- à définir --"
			/>
		{/if}
	</div>
{/snippet}

<div>
	<CompetitionMenu bind:currentCompetition />

	<h2>Commencer la compétition</h2>
	<h3>Liste des flys</h3>

	{#if flys.length > 0}
		{#if rules?.regulation.teamGame}
			<!-- Compétition par équipe -->
			{@const flysId = flys.map((f) => f.id)}
			{@const flysOrder = flys.map((f) => 'Fly #' + f.order)}
			{#each flys as fly, i}
				<div class="fly">
					{fly.order}
					{#each fly.teamsId as teamId, j}
						{@const teamFly = teamsCompetitionStore.find(teamId)}
						<div class="team-in-fly">
							{teamFly?.name}
							<span class="edit-fly" role="none" onclick={() => editTeamFly(i, j)}>✏️</span>
							{#if editingFly[i * nbTeamsPerFly + j]}
								<Selector
									bind:value={newIdFly}
									options={flysId}
									optionsLabel={flysOrder}
									onchange={() => updateTeamFly(fly.id, newIdFly, teamId)}
								/>
							{/if}
						</div>
					{/each}
					{@render addSupervisor(fly, i)}
				</div>
			{/each}
			<div class="action">
				<button onclick={() => calculateFlys()} class="btn btn-secondary"
					>Recalculer les flys</button
				>
				<button onclick={() => (showBox = true)} class="btn">Voir le résumé</button>
			</div>
		{:else}
			<!-- Compétition individuelle -->
			{#each flys as fly, i}
				{@const flysId = flys.map((f) => f.id)}
				{@const flysOrder = flys.map((f) => 'Fly #' + f.order)}
				<div class="fly">
					{fly.order}
					{#each fly.playersId as playerId, j}
						{@const playerFly = playersChampionshipStore.find(playerId)}
						<div class="player-in-fly">
							{playerFly?.name}
							<span class="edit-fly" role="none" onclick={() => editPlayerFly(i, j)}>✏️</span>
							{#if editingFly[i * nbPlayersPerFly + j]}
								<Selector
									bind:value={newIdFly}
									options={flysId}
									optionsLabel={flysOrder}
									onchange={() => updatePlayerFly(fly.id, newIdFly, playerId)}
								/>
							{/if}
						</div>
					{/each}
					{@render addSupervisor(fly, i)}
				</div>
			{/each}
			<div class="action">
				<button onclick={() => calculateFlys()} class="btn btn-secondary"
					>Recalculer les flys</button
				>
				<button onclick={() => (showBox = true)} class="btn">Voir le résumé</button>
			</div>
		{/if}
	{:else}
		<p>Les flys ne sont pas définis</p>
		<div class="action">
			<button onclick={() => calculateFlys()} class="btn btn-primary">Calculer les flys</button>
			<button onclick={() => (showBox = true)} class="btn">Voir le résumé</button>
		</div>
	{/if}

	{#if showBox}
		<CompetitionSummaryBox {currentCompetition} {championship} bind:showBox />
	{/if}
	{#if courseCompetition && courseCompetition?.targets.length > 0}
		<p>Si ce n'est pas fait, veuillez définir les arbitres</p>
		{#if flys.length > 0}
			<button onclick={start} class="btn btn-primary"> Lancer la compétition </button>
		{/if}
	{:else}
		<button onclick={() => (currentCompetition.step = 'course')}
			>Veuillez définir le parcours ...</button
		>
	{/if}
</div>

<style>
	.supervisor-wrapper {
		display: inherit;
	}

	.fly {
		background-color: var(--bg-card);
		margin-bottom: 10px;
		padding: 10px;
	}

	.player-in-fly {
		display: flex;
		font-weight: bold;
	}

	.team-in-fly {
		display: flex;
		font-weight: bold;
	}

	.edit-fly {
		margin-left: auto;
	}
</style>
