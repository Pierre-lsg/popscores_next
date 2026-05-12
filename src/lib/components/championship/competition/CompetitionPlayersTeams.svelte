<script lang="ts">
	import type { Competition } from '$lib/types/competitionType';
	import type { Team } from '$lib/types/teamType';
	import type { Regulations } from '$lib/types/regulationsType';
	import type { Championship } from '$lib/types/championshipType';

	import { playersChampionshipStore } from '$lib/stores/championship/playersChampionshipStore.svelte';
	import { teamsChampionshipStore } from '$lib/stores/championship/teamsChampionshipStore.svelte';
	import { teamsCompetitionStore } from '$lib/stores/championship/teamsCompetitionStore.svelte';
	import { clubsStore } from '$lib/stores/championship/clubsStore.svelte';

	import { getFilteredTeams } from '$lib/utils/championship/competitionsFunctions.svelte';

	import { getRules } from '$lib/utils/championship/competitionsFunctions.svelte';
	import Param from '$lib/ui/Param.svelte';
	import Selector from '$lib/ui/Selector.svelte';
	import TeamCard from '$lib/components/core_game/TeamCard.svelte';
	import CompetitionEditTeam from './CompetitionEditTeam.svelte';

	let { currentCompetition = $bindable(), championship = $bindable() } = $props<{
		currentCompetition: Competition | undefined;
		championship: Championship;
	}>();

	let clubs = clubsStore.list.filter((c) => c.championshipId === championship.id);
	let clubFilter: string = $state('');
	let nameFilter: string = $state('');
	let editingCompetingTeam: boolean[] = $state([]);
	let editingAvailableTeam: boolean[] = $state([]);
	let addingTeam: boolean = $state(false);
	let newTeamsName: string = $state('');
	let newTeamsClub: string = $state('');

	let rules: Regulations = $state(getRules(currentCompetition));

	let competitionTeams: Team[] = $derived(
		teamsChampionshipStore.list.filter((team: Team) => currentCompetition.teamsId.includes(team.id))
	);
	let availableTeams: Team[] = $derived(
		teamsChampionshipStore.list.filter(
			(team: Team) =>
				!currentCompetition.teamsId.includes(team.id) &&
				clubs.map((c) => c.id).includes(team.clubId)
		)
	);
	let filteredTeams: Team[] = $derived(getFilteredTeams(availableTeams, clubFilter, nameFilter));

	const engageTeam = (index: number) => {
		const aTeam = filteredTeams[index];
		aTeam.sessionId = currentCompetition.id;
		aTeam.id = crypto.randomUUID();
		currentCompetition.teamsId.push(aTeam.id);
		teamsCompetitionStore.load(aTeam);
		engageClub(aTeam.clubId);
	};

	const disengageTeam = (index: number) => {
		const clubId = competitionTeams[index].clubId;
		currentCompetition.teamsId = currentCompetition.teamsId.filter(
			(id: string) => id !== competitionTeams[index].id
		);
		teamsCompetitionStore.remove(competitionTeams[index].id);
		disengageClub(clubId);
	};

	const addTeam = () => {
		if (newTeamsClub === '') {
			newTeamsClub = clubsStore.list.find((c) => c.name === 'hors asso')?.id || '';
		}

		const aTeam = teamsChampionshipStore.add(newTeamsName, newTeamsClub);
		engageClub(newTeamsClub);
		clubsStore.addTeam(newTeamsClub, aTeam.id);
		newTeamsName = newTeamsClub = '';
		addingTeam = false;
	};

	const engageClub = (clubId: string | undefined) => {
		if (clubId && !currentCompetition.clubsId.includes(clubId)) {
			currentCompetition.clubsId.push(clubId);
		}
	};

	const disengageClub = (clubId: string | undefined) => {
		let isClubStillEngaged: boolean = false;

		if (clubId && clubId !== '') {
			for (let team of competitionTeams) {
				if (team.clubId === clubId) isClubStillEngaged = true;
			}
			if (!isClubStillEngaged) {
				currentCompetition.clubsId = currentCompetition.clubsId.filter(
					(id: string) => id !== clubId
				);
			}
		}
	};

	const editCompetingTeam = (index: number) => {
		editingCompetingTeam[index] = !editingCompetingTeam[index];
		for (let i = 0; i < editingCompetingTeam.length; i++) {
			if (index !== i) editingCompetingTeam[i] = false;
		}
	};

	const editAvailableTeam = (index: number) => {
		editingAvailableTeam[index] = !editingAvailableTeam[index];
		for (let i = 0; i < editingAvailableTeam.length; i++) {
			if (index !== i) editingAvailableTeam[i] = false;
		}
	};
</script>

<div>
	<h3>Equipes engagés ...</h3>
	{#if competitionTeams.length > 0}
		{#each competitionTeams as team, i}
			<div class="d-flex">
				<span role="none" onclick={() => disengageTeam(i)} class="selectable-item">
					<TeamCard
						{team}
						players={playersChampionshipStore.list}
						playersPerTeam={rules.regulation.playersPerTeam || 2}
					/>
				</span>
				<span class="edit-team" role="none" onclick={() => editCompetingTeam(i)}>✏️</span>
			</div>
		{/each}
	{:else}
		<p>Aucune équipe n'est engagée dans la compétition</p>
	{/if}

	{#each competitionTeams as team, i}
		{#if editingCompetingTeam[i]}
			<CompetitionEditTeam
				{team}
				players={playersChampionshipStore.list}
				playersPerTeam={rules.regulation.playersPerTeam || 2}
			/>
		{/if}
	{/each}

	<hr />

	{#if !addingTeam}
		<h3>Equipes disponibles</h3>
		<Selector
			id="selectClub"
			bind:value={clubFilter}
			label="Asso"
			options={clubs.map((club) => club.id)}
			optionsLabel={clubs.map((club) => club.name)}
			unselectedOption="-- Choisis une asso --"
		/>
		<Param label="Nom" bind:value={nameFilter} oneline={true} />
		{#if filteredTeams.length > 0}
			{#each filteredTeams as team, i}
				<div class="d-flex">
					<span role="none" onclick={() => engageTeam(i)} class="selectable-item">
						<TeamCard
							{team}
							players={playersChampionshipStore.list}
							playersPerTeam={rules.regulation.playersPerTeam || 2}
						/>
					</span>
					<span class="edit-team" role="none" onclick={() => editAvailableTeam(i)}>✏️</span>
				</div>
			{/each}
		{:else}
			<p>Aucune équipe n'est disponible.</p>
			<p>Veuillez créer ou définir de nouvelles équipes ou alléger les filtres ...</p>
		{/if}

		{#each filteredTeams as team, i}
			{#if editingAvailableTeam[i]}
				<CompetitionEditTeam
					{team}
					players={playersChampionshipStore.list}
					playersPerTeam={rules.regulation.playersPerTeam || 2}
				/>
			{/if}
		{/each}

		<hr />

		<button onclick={() => (addingTeam = !addingTeam)} class="btn btn-primary"
			>Ajouter une équipe ...
		</button>
	{:else}
		<h3>Nouvelle équipe</h3>

		<div class="item-form">
			<Param label="Nom" bind:value={newTeamsName} />
			<Selector
				id="selectClub"
				bind:value={newTeamsClub}
				label="Asso"
				options={clubs.map((club) => club.id)}
				optionsLabel={clubs.map((club) => club.name)}
			/>
			<div class="action">
				<button onclick={addTeam} class="btn btn-primary">Valider</button>
				<button onclick={() => (addingTeam = false)} class="btn">Annuler</button>
			</div>
		</div>
	{/if}
</div>

<style>
	.edit-team {
		margin-left: auto;
	}
</style>
