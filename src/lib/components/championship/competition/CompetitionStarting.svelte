<script lang="ts">
	import type { Competition } from '$lib/types/competitionType';
	import type { Regulations } from '$lib/types/regulationsType';
	import type { Championship } from '$lib/types/championshipType';
	import type { Fly } from '$lib/types/flyType';
	import type { User } from '$lib/types/userType';

	import { shuffle } from '$lib/utils/sharedFunction';
	import { toastStore } from '$lib/stores/toastStore.svelte';
	import { getSupervisors } from '$lib/utils/championship/championshipFunctions.svelte';
	import { cloudSaveAllCompetition } from '$lib/utils/championship/competitionsFunctions.svelte';

	import CompetitionMenu from './CompetitionMenu.svelte';
	import Selector from '$lib/ui/Selector.svelte';

	import { getRules } from '$lib/utils/championship/competitionsFunctions.svelte';
	import { flysChampionshipStore } from '$lib/stores/championship/flysChampionshipStore.svelte';
	import { playersChampionshipStore } from '$lib/stores/championship/playersChampionshipStore.svelte';
	import { teamsChampionshipStore } from '$lib/stores/championship/teamsChampionshipStore.svelte';
	import { teamsCompetitionStore } from '$lib/stores/championship/teamsCompetitionStore.svelte';
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
	let newIdFly: string = $state('');
	let editingFly: boolean[] = $state([]);

	let supervisors: User[] = $state([]);
	let isAttachingSupervisor: boolean[] = $state([]);
	let showBox: boolean = $state(false);

	const startCompetition = async () => {
		if (confirm('Voulez-vous figer les flys et démarrer la compétition ?')) {
			currentCompetition.status = 'in_progress';
			currentCompetition.step = 'welcome';

			//Figer les équipes de la compétition
			currentCompetition.teamsId.forEach((teamId: string) => {
				const aTeam = teamsChampionshipStore.find(teamId);
				if (aTeam) {
					aTeam.sessionId = currentCompetition.id;
					teamsCompetitionStore.findByIdAndSession(aTeam.id, aTeam.sessionId || '');
					teamsCompetitionStore.load(aTeam);
				}
			});
			//teamsCompetitionStore.find

			// mettre à jour dans le Cloud la compétition et ses éléments dans le Cloud
			let status = await cloudSaveAllCompetition(currentCompetition, championship.id);

			switch (status) {
				case 'success':
					toastStore.show('💾 Compétition mise à jour ...', 'success');
					break;
				case 'failure':
					toastStore.show("💾 Echec à l'enregistrement ...", 'failure');
					break;
				default:
					toastStore.show('💾 Enregsistrement en cours ...', 'failure');
			}
		}
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
		else return '';
	};

	onMount(async () => {
		supervisors = await getSupervisors();
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
						{@const teamFly = teamsChampionshipStore.find(teamId)}
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
			<button onclick={() => calculateFlys()}>Recalculer les flys</button>
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
			<button onclick={() => calculateFlys()}>Recalculer les flys</button>
		{/if}
	{:else}
		<p>Les flys ne sont pas définis</p>
		<button onclick={() => calculateFlys()}>Calculer les flys</button>
	{/if}

	<button onclick={() => (showBox = true)}>Voir le résumé</button>

	{#if showBox}
		<CompetitionSummaryBox {currentCompetition} {championship} bind:showBox />
	{/if}

	{#if flys.length > 0}
		<button onclick={startCompetition}> Lancer la compétition </button>
	{/if}

	<p>Une fois la compétition lancée les flys ne peuvent etre modifié</p>
	<p>
		Au mieux des joueurs et équipes 'sans club' seront ajoutables par le responsable de la carte de
		score
	</p>
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
