<script lang="ts">
	import { clubsStore } from '$lib/stores/clubsStore.svelte';
	import { teamsChampionshipStore } from '$lib/stores/teamsChampionshipStore.svelte';

	import Param from '$lib/ui/Param.svelte';

	import type { Club } from '$lib/types/clubType';
	import type { Team } from '$lib/types/teamType';

	let { currentClub = $bindable('') } = $props<{
		currentClub: string;
	}>();

	let club: Club = clubsStore.list.filter((c) => c.id === currentClub)[0];

	let teams = $derived<Team[]>(teamsChampionshipStore.list.filter((t) => t.clubId === currentClub));
	let numTeams: number = $derived(teams.length);

	let creatingNewTeam: boolean = $state(false);
	let editingTeam: boolean[] = $state([]);
	let teamName: string = $state('');

	// Function to add a new team
	const addNewTeam = () => {
		teamsChampionshipStore.add(teamName, club.id);
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

<div class="teams-list">
	{#each teams as team, i}
		<div class="team-item">
			<div role="none" class="team-card">
				<div class="details">
					{team.name}
				</div>
			</div>
			<div class="action">
				<button onclick={() => removeTeam(team.id)}> 🗑️ </button>
				<button onclick={() => editTeam(i)}>✏️</button>
			</div>
		</div>
	{/each}
</div>

{#each teams as team, i}
	{#if editingTeam[i]}
		<div class="team-form">
			<h3>Modifier l'équipe 👥</h3>
			<Param label="Nom du joueur" type="text" bind:value={team.name} />
		</div>
	{/if}
{/each}

{#if teams.length === 0}
	<p>Aucune équipe enregistrée pour le moment. 🏆</p>
{/if}

<button onclick={() => (creatingNewTeam = true)}>Ajouter une nouvelle équipe</button>

{#if creatingNewTeam}
	<div class="team-form">
		<h3>Nouvelle équipe 👥</h3>
		<Param label="Nom de l'équipe" type="text" bind:value={teamName} />
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

	.action {
		display: flex;
		flex-direction: row;
		justify-content: center;
		width: 100%;
		gap: 2rem;
		margin-top: 0.5rem;
	}
</style>
