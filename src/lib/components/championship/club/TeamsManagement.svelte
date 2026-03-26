<script lang="ts">
	import { clubsStore } from '$lib/stores/championship/clubsStore.svelte';
	import { playersChampionshipStore } from '$lib/stores/championship/playersChampionshipStore.svelte';
	import { teamsChampionshipStore } from '$lib/stores/championship/teamsChampionshipStore.svelte';

	import Param from '$lib/ui/Param.svelte';
	import TeamEditing from './TeamEditing.svelte';

	import type { Club } from '$lib/types/clubType';
	import type { Player } from '$lib/types/playerType';
	import type { Team } from '$lib/types/teamType';
	import { onMount } from 'svelte';

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

	onMount(() => {
		club.teamsId = teams.map((t) => t.id);
	});
</script>

{#if !isEditingTeam && !creatingNewTeam}
	<div class="item-list">
		{#each teams as team, i}
			<div role="none" class="item-details" onclick={() => editTeam(i)}>
				<div role="none" class="team-card item-card">
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
			<div class="item-form">
				<TeamEditing {currentClub} {team} {clubPlayers} />
				<div class="action">
					<button onclick={() => editTeam(i)} class="btn btn-primary"> Valider </button>
					<button onclick={() => removeTeam(team)} class="btn"> 🗑️ Supprimer</button>
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
	<button onclick={() => (creatingNewTeam = true)} class="btn btn-primary"
		>Ajouter une nouvelle équipe</button
	>
{/if}

{#if creatingNewTeam}
	<div class="item-form">
		<h3 style="margin-top: 0">Nouvelle équipe 👥</h3>
		<Param
			label="Nom de l'équipe"
			type="text"
			bind:value={teamName}
			focus={true}
			placeholder="Nom de l'équipe"
		/>
		<div class="action">
			<button onclick={addNewTeam} class="btn btn-primary">Créer</button>
			<button onclick={() => (creatingNewTeam = false)} class="btn">Annuler</button>
		</div>
	</div>
{/if}

<style>
	.team-card {
		width: 100%;
	}

	.team-card:hover {
		transform: translateY(-5px);
		border-color: var(--border-color);
	}

	.details {
		align-items: center;
		margin: 0.5rem;
		gap: 8px;
	}
</style>
