<script lang="ts">
	import type { Competition } from '$lib/types/competitionType';
	import type { Fly } from '$lib/types/flyType';

	import CompetitionMenu from './CompetitionMenu.svelte';
	import Selector from '$lib/ui/Selector.svelte';
	import { flysChampionshipStore } from '$lib/stores/championship/flysChampionshipStore.svelte';
	import { teamsChampionshipStore } from '$lib/stores/championship/teamsChampionshipStore.svelte';
	import { playersChampionshipStore } from '$lib/stores/championship/playersChampionshipStore.svelte';
	import { isCompetitionTeam } from '$lib/utils/championship/competitionsFunctions.svelte';
	import { formatList } from '$lib/utils/sharedFunction';
	import { userService } from '$lib/utils/pocketbase/users2Cloud';
	import { onMount } from 'svelte';
	import type { User } from '$lib/types/userType';

	let { currentCompetition = $bindable(), currentFly = $bindable() } = $props<{
		currentCompetition: Competition | undefined;
		currentFly: Fly | undefined;
	}>();

	let flys: Fly[] = $derived(
		flysChampionshipStore.list.filter((fly) => currentCompetition.flysId.includes(fly.id))
	);
	let allFlysCompleted: boolean = $state(false);
	let supervisors: User[] = $state([]);
	let isAttachingSupervisor: boolean[] = $state([]);

	const validating = () => {
		currentCompetition.status = 'finished';
		currentCompetition.step = 'welcome';
	};

	const loadingFly = (fly: Fly) => {
		currentFly = fly;
	};

	const listCompetitors = (fly: Fly) => {
		let compList: string[] = [];
		if (isCompetitionTeam(currentCompetition)) {
			fly.teamsId.forEach((teamId) => {
				compList.push(teamsChampionshipStore.list.find((t) => t.id === teamId)?.name || '');
			});
		} else {
			fly.playersId.forEach((playerId) => {
				compList.push(playersChampionshipStore.list.find((t) => t.id === playerId)?.name || '');
			});
		}
		return formatList(compList);
	};

	const displaySupervisor = (fly: Fly) => {
		let supervisor = supervisors.find((s) => s.id === fly.supervisorId);
		if (supervisor) return supervisor.name;
		else return '';
	};

	onMount(() => {
		if (!currentCompetition.playersId) currentCompetition.playersId = [];
		if (!currentCompetition.teamsId) currentCompetition.teamsId = [];
		if (!currentCompetition.flysId) currentCompetition.flysId = [];

		// check all flys
		allFlysCompleted = flys.every((fly) => fly.status === 'validated');

		// Retrieve all the marshalls
		getSupervisors();
	});

	const getSupervisors = async () => {
		let users: any = await userService.getByRole('marshall');

		if (Array.isArray(users)) {
			users.forEach((u) =>
				supervisors.push({
					id: u.id,
					email: '',
					emailVisibility: false,
					verified: true,
					name: u.name,
					roles: []
				})
			);
		}
	};
</script>

<div>
	<CompetitionMenu bind:currentCompetition />
	<h2>Saisir les scores</h2>
	<div class="fly-list">
		{#each flys as fly, i}
			<div class="fly-item">
				<div role="none" class="fly-card" onclick={() => loadingFly(fly)}>
					<span style="font-size: larger">Fly #{fly.order} </span>
					<span style="font-size: smaller">{listCompetitors(fly)}</span>
					<span style="font-size: smaller">🌟 {displaySupervisor(fly)} 🌟</span>
					<span style="font-size: smaller">{fly.status || 'inconnu'}</span>
				</div>
				<div class="action">
					<button onclick={() => (isAttachingSupervisor[i] = !isAttachingSupervisor[i])}>
						🌟
					</button>
					<button onclick={() => alert('Récupérer résultats du Cloud ...')}> ☁️ </button>
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
		{/each}
	</div>

	<h3>En organisateur</h3>
	<p>Lister l'ensemble des flys et afficher la carte de score</p>
	<p>Permettre d'import de carte depuis le Cloud</p>
	<p>Controle de l'état de chaque carte</p>
	<p>Si toutes les cartes validées par les responsables de fly</p>
	<p>--> Validation de la compétition</p>

	{#if allFlysCompleted}
		<button onclick={validating} class="subnav"> Valider l'ensemble des cartes </button>
	{/if}
</div>

<style>
	.fly-list {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		margin: 0rem;
	}

	.fly-item {
		display: flex;
		flex-direction: column;
		width: 95%;
		margin-bottom: 1rem;
	}

	.fly-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		background-color: var(--bg-card);
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		cursor: pointer;
		margin: 0 0.5rem 0 0;
		padding: 0.5rem 0;
	}

	.fly-card:hover {
		transform: translateY(-5px);
		border-color: var(--border-color);
	}
</style>
