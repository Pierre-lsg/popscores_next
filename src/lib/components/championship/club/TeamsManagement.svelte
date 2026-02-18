<script lang="ts">
	import { clubsStore } from '$lib/stores/championship/clubsStore.svelte';
	import { playersChampionshipStore } from '$lib/stores/championship/playersChampionshipStore.svelte';
	import { teamsChampionshipStore } from '$lib/stores/championship/teamsChampionshipStore.svelte';

	import Param from '$lib/ui/Param.svelte';
	import TeamEditing from './TeamEditing.svelte';

	import type { Club } from '$lib/types/clubType';
	import type { Player } from '$lib/types/playerType';
	import type { Team } from '$lib/types/teamType';

	let { currentClub = $bindable('') } = $props<{
		currentClub: string;
	}>();

	let club: Club = clubsStore.list.filter((c) => c.id === currentClub)[0];

	let teams = $derived<Team[]>(teamsChampionshipStore.list.filter((t) => t.clubId === currentClub));
	let numTeams: number = $derived(teams.length);

	let clubPlayers = $derived<Player[]>(
		playersChampionshipStore.list.filter((p) => p.clubId === currentClub)
	);

	let creatingNewTeam: boolean = $state(false);
	let editingTeam: boolean[] = $state([]);
	let isEditingTeam: boolean = $state(false);
	let teamName: string = $state('');

	// Function to add a new team
	const addNewTeam = () => {
		const newTeam = teamsChampionshipStore.add(teamName, club.id);
		if (!club.teamsId.includes(newTeam.id)) {
			club.teamsId.push(newTeam.id);
		}

		teamName = '';
		creatingNewTeam = false;
	};

	// Function to remove a team
	const removeTeam = (team: Team) => {
		if (confirm('Voulez-vous vraiment supprimer cette équipe ?')) {
			team.playersId.forEach((id) => {
				const player = playersChampionshipStore.list.find((p) => p.id === id);
				if (player) player.teamId = '';
			});
			teamsChampionshipStore.remove(team.id);
		}
		// Todo : fix this. It should the derived runes which recalculate this
		teams = teamsChampionshipStore.list.filter((t) => t.clubId === currentClub);
	};

	// Function to toggle editing of a team
	const editTeam = (index: number) => {
		for (let i = 0; i < numTeams; i++) {
			if (i !== index) editingTeam[i] = false;
		}
		editingTeam[index] = !editingTeam[index];
		isEditingTeam = editingTeam.some((value) => value === true);
	};
</script>

{#if !isEditingTeam && !creatingNewTeam}
	<div class="teams-list">
		{#each teams as team, i}
			<div role="none" class="team-item" onclick={() => editTeam(i)}>
				<div role="none" class="team-card">
					<div class="details">
						{team.name}
					</div>
					<div class="details">
						<ul>
							{#each clubPlayers.filter((p) => p.teamId === team.id) as player}
								<li>{player.name}</li>
							{/each}
						</ul>
					</div>
				</div>
			</div>
		{/each}
	</div>
{:else}
	<!-- Form for team's editing -->
	{#each teams as team, i}
		{#if editingTeam[i]}
			<div class="team-form">
				<TeamEditing {currentClub} {team} {clubPlayers} />
				<div class="action">
					<button onclick={() => editTeam(i)}> Valider </button>
					<button onclick={() => removeTeam(team)}> 🗑️ Supprimer</button>
				</div>
			</div>
		{/if}
	{/each}
{/if}

{#if teams.length === 0}
	<p>Aucune équipe enregistrée pour le moment. 🏆</p>
{/if}

<!-- Adding a new team-->
{#if !isEditingTeam && !creatingNewTeam}
	<button onclick={() => (creatingNewTeam = true)}>Ajouter une nouvelle équipe</button>
{/if}

{#if creatingNewTeam}
	<div class="team-form">
		<h3 style="margin-top: 0">Nouvelle équipe 👥</h3>
		<Param
			label="Nom de l'équipe"
			type="text"
			bind:value={teamName}
			focus={true}
			placeholder="Nom de l'équipe"
		/>
		<div class="action">
			<button onclick={addNewTeam}>Créer</button>
			<button onclick={() => (creatingNewTeam = false)}>Annuler</button>
		</div>
	</div>
{/if}

<style>
	.teams-list {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		margin: 0rem;
	}

	.team-item {
		display: flex;
		flex-direction: column;
		width: 95%;
		margin-bottom: 1rem;
	}

	.team-card {
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
	}

	.team-card:hover {
		transform: translateY(-5px);
		border-color: var(--border-color);
	}

	.team-form {
		border: 1px var(--primary) solid;
		padding: 0.5rem;
		border-radius: 0.5rem;
	}

	.team-form {
		border: 1px var(--primary) solid;
		padding: 0.5rem;
		border-radius: 0.5rem;
	}

	.details {
		align-items: center;
		margin: 0.5rem;
		gap: 8px;
	}

	.action {
		display: flex;
		justify-content: space-between;
		margin: 1rem 0.5rem 0 0;
	}
</style>
