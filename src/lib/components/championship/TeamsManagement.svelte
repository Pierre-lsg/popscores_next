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
	const removeTeam = (teamId: string) => {
		if (confirm('Voulez-vous vraiment supprimer cette équipe ?')) {
			teamsChampionshipStore.remove(teamId);
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
	};
</script>

<!-- Teams's list -->
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

<!-- Form for team's editing -->
{#each teams as team, i}
	{#if editingTeam[i]}
		<TeamEditing {currentClub} {team} {clubPlayers} />
		<button onclick={() => removeTeam(team.id)}> 🗑️ </button>
	{/if}
{/each}

{#if teams.length === 0}
	<p>Aucune équipe enregistrée pour le moment. 🏆</p>
{/if}

<!-- Adding a new team-->
{#if !editingTeam.some(Boolean)}
	<button onclick={() => (creatingNewTeam = true)}>Ajouter une nouvelle équipe</button>
{/if}

{#if creatingNewTeam}
	<div class="team-form">
		<h3>Nouvelle équipe 👥</h3>
		<Param
			label="Nom de l'équipe"
			type="text"
			bind:value={teamName}
			focus={true}
			placeholder="Nom de l'équipe"
		/>
		<button onclick={addNewTeam}>Créer</button>
		<button onclick={() => (creatingNewTeam = false)}>Annuler</button>
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
		border-color: var(--primary);
	}

	.details {
		align-items: center;
		margin: 0.5rem;
		gap: 8px;
	}

	.team-players {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		width: 100%;
	}

	select {
		padding: 0.5rem;
		width: 60%;
	}
</style>
