<script lang="ts">
	import type { Competition } from '$lib/types/competitionType';
	import type { Championship } from '$lib/types/championshipType';
	import type { Fly } from '$lib/types/flyType';
	import type { Team } from '$lib/types/teamType';
	import type { Player } from '$lib/types/playerType';
	import QRCode from '$lib/ui/QRCode.svelte';
	import { toastStore } from '$lib/stores/toastStore.svelte';

	import CompetitionMenu from './CompetitionMenu.svelte';
	import Selector from '$lib/ui/Selector.svelte';
	import { flysChampionshipStore } from '$lib/stores/championship/flysChampionshipStore.svelte';
	import { teamsCompetitionStore } from '$lib/stores/championship/teamsCompetitionStore.svelte';
	import { playersChampionshipStore } from '$lib/stores/championship/playersChampionshipStore.svelte';
	import { isCompetitionTeam } from '$lib/utils/championship/competitionsFunctions.svelte';
	import { formatList } from '$lib/utils/sharedFunction';
	import { getSupervisors } from '$lib/utils/championship/championshipFunctions.svelte';
	import { onMount } from 'svelte';
	import type { User } from '$lib/types/userType';
	import { competitionService } from '$lib/utils/pocketbase/competitions2Cloud';
	import { refereesStore } from '$lib/stores/championship/refereeChampionshipStore.svelte';
	import { playerService } from '$lib/utils/pocketbase/players2Cloud';
	import type { Result } from '$lib/types/resultType';
	import { resultService } from '$lib/utils/pocketbase/results2Cloud';
	import { resultsCompetitionStore } from '$lib/stores/championship/resultsCompetitionStore.svelte';
	import { flyService } from '$lib/utils/pocketbase/flys2Cloud';

	let {
		currentCompetition = $bindable(),
		championship = $bindable(),
		currentFly = $bindable()
	} = $props<{
		currentCompetition: Competition | undefined;
		championship: Championship;
		currentFly: Fly | undefined;
	}>();

	let flys: Fly[] = $derived(
		flysChampionshipStore.list.filter((fly) => currentCompetition.flysId.includes(fly.id))
	);
	let allFlysCompleted: boolean = $state(false);
	let supervisors: User[] = $state([]);
	let isAttachingSupervisor: boolean[] = $state([]);

	let qrRefereeConnect: string = $state('');

	const validating = () => {
		if (confirm('Validez-vous les résultats ?')) {
			currentCompetition.status = 'finished';
			currentCompetition.step = 'welcome';
			competitionService.saveCompetition(currentCompetition, championship.id);
		}
	};

	const loadingFly = (fly: Fly) => {
		currentFly = fly;
	};

	const listTeamPlayers = (team: Team) => {
		let playerList: string[] = [];
		team.playersId.forEach((aPlayerId) => {
			playerList.push(playersChampionshipStore.find(aPlayerId)?.name || '👻');
		});
		return formatList(playerList);
	};

	const listCompetitors = (fly: Fly) => {
		let compList: string[] = [];
		fly.playersId.forEach((playerId) => {
			compList.push(playersChampionshipStore.list.find((t) => t.id === playerId)?.name || '');
		});
		return formatList(compList);
	};

	const displaySupervisor = (fly: Fly) => {
		let supervisor = supervisors.find((s) => s.id === fly.supervisorId);
		if (supervisor) return supervisor.name;
		else return '';
	};

	const editQrConnect = async (fly: Fly) => {
		try {
			let refereeLogin: string = refereesStore.find(fly.supervisorId)?.email || '';
			let refereePass: string = refereesStore.find(fly.supervisorId)?.password || '';

			if (!refereeLogin) {
				throw new Error("❌ Login de l'arbitre manquant");
			}

			if (!refereePass) {
				throw new Error("❌ Mot de passe de l'arbitre manquant");
			}

			qrRefereeConnect = `${window.location.origin}/?ident=${refereeLogin}&pass=${refereePass}`;
			await navigator.clipboard.writeText(qrRefereeConnect);

			// On déclenche le toast !
			toastStore.show('🔗 Lien de partage copié !');
		} catch (err) {
			toastStore.show(err instanceof Error ? err.message : String(err));
		}
	};

	const refreshFly = async (aFly: Fly) => {
		if (confirm('Voulez-vous récupérer les données du fly #' + aFly.order + ' ?')) {
			const cloudFly = await flyService.getFlyById(aFly.id);
			let playersId: string[] = [];

			if (cloudFly) aFly.status = cloudFly.status;

			// Compétition par équipe
			if (isCompetitionTeam(currentCompetition)) {
				aFly.teamsId.forEach((teamId) => {
					const team = teamsCompetitionStore.findByIdAndSession(teamId, currentCompetition);
					playersId.push(...(team?.playersId || []));
				});
			}
			// Compétition individuelle
			else playersId = aFly.playersId;

			playersId.forEach(async (aPlayerId) => {
				console.log('rafraichissement player : ', aPlayerId);
				const aPlayer: Player = await playerService.getPlayerById(aPlayerId);
				if (aPlayer) {
					console.log('update player : ', aPlayer);
					playersChampionshipStore.remove(aPlayerId);
					playersChampionshipStore.load(aPlayer);
				}

				const aResult: Result[] = await resultService.getResultsByCompetitionAndPlayer(
					currentCompetition.id,
					aPlayerId
				);
				if (aResult[0]) {
					resultsCompetitionStore.remove(currentCompetition.id, aPlayerId);
					resultsCompetitionStore.load(aResult[0]);
				}
			});
		}
	};

	onMount(async () => {
		// check all flys
		allFlysCompleted = flys.every((fly) => fly.status === 'validated');

		// Retrieve all the marshalls
		supervisors = await getSupervisors(championship);
	});
</script>

<div>
	<CompetitionMenu bind:currentCompetition />
	<h2>Saisir les scores</h2>
	<div class="fly-list">
		{#each flys as fly, i}
			<div class="fly-item">
				<div role="none" class="fly-card" onclick={() => loadingFly(fly)}>
					<span style="font-size: larger">Fly #{fly.order} </span>
					{#if isCompetitionTeam(currentCompetition)}
						<ul>
							{#each fly.teamsId as teamId}
								{@const aTeam = teamsCompetitionStore.findByIdAndSession(
									teamId,
									currentCompetition
								)}
								{#if aTeam}
									<li>
										<span style="font-size: smaller">{aTeam.name} ({listTeamPlayers(aTeam)})</span>
									</li>
								{/if}
							{/each}
						</ul>
					{:else}
						<span style="font-size: smaller">{listCompetitors(fly)}</span>
					{/if}
					<span style="font-size: smaller">🌟 {displaySupervisor(fly)} 🌟</span>
					<span style="font-size: smaller">{fly.status || 'inconnu'}</span>
				</div>
				<div class="action">
					<button onclick={() => (isAttachingSupervisor[i] = !isAttachingSupervisor[i])}>
						🌟
					</button>
					<button onclick={() => editQrConnect(fly)}> 🚪 </button>
					<button onclick={() => refreshFly(fly)}> 🔍 </button>
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

	{#if qrRefereeConnect !== ''}
		<div role="none" onclick={() => (qrRefereeConnect = '')}>
			<QRCode data={qrRefereeConnect} size={400} />
		</div>
	{/if}

	{#if allFlysCompleted}
		<button onclick={validating} class="btn btn-primary"> Valider l'ensemble des cartes </button>
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
