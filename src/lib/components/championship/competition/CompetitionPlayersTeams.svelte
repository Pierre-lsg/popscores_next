<script lang="ts">
	import type { Competition } from '$lib/types/competitionType';
	import type { Player } from '$lib/types/playerType';
	import type { Team } from '$lib/types/teamType';

	import { playersChampionshipStore } from '$lib/stores/championship/playersChampionshipStore.svelte';
	import { teamsChampionshipStore } from '$lib/stores/championship/teamsChampionshipStore.svelte';
	import { clubsStore } from '$lib/stores/championship/clubsStore.svelte';
	import {
		getFilteredTeams,
		getFilteredPlayers
	} from '$lib/utils/championship/competitionsFunctions.svelte';
	import { listTeamPlayer } from '$lib/utils/session/golfScoringFunction.svelte';

	import { onMount } from 'svelte';
	import Param from '$lib/ui/Param.svelte';
	import Selector from '$lib/ui/Selector.svelte';

	let { currentCompetition = $bindable() } = $props<{
		currentCompetition: Competition | undefined;
	}>();

	let clubFilter: string = $state('');
	let nameFilter: string = $state('');

	let competitionPlayers: Player[] = $derived(
		playersChampionshipStore.list.filter((player) =>
			currentCompetition.playersId.includes(player.id)
		)
	);
	let availablePlayers: Player[] = $derived(
		playersChampionshipStore.list.filter(
			(player) => !currentCompetition.playersId.includes(player.id)
		)
	);
	let filteredPlayers: Player[] = $derived(
		getFilteredPlayers(availablePlayers, clubFilter, nameFilter)
	);
	let competitionTeams: Team[] = $derived(
		teamsChampionshipStore.list.filter((team: Team) => currentCompetition.teamsId.includes(team.id))
	);
	let availableTeams: Team[] = $derived(
		teamsChampionshipStore.list.filter(
			(team: Team) => !currentCompetition.teamsId.includes(team.id)
		)
	);
	let filteredTeams: Team[] = $derived(getFilteredTeams(availableTeams, clubFilter, nameFilter));

	const engageTeam = (index: number) => {
		currentCompetition.teamsId.push(filteredTeams[index].id);
	};

	const disengageTeam = (index: number) => {
		currentCompetition.teamsId = currentCompetition.teamsId.filter(
			(id: string) => id !== competitionTeams[index].id
		);
	};

	onMount(() => {
		// debug
		// teamsChampionshipStore.list.forEach((t) => (t.playersId = []));
		// playersChampionshipStore.list.forEach((p) => (p.teamId = ''));
	});
</script>

<div>
	<h3>Equipes engagés ...</h3>
	{#if competitionTeams.length > 0}
		{#each competitionTeams as team, i}
			<div role="none" onclick={() => disengageTeam(i)} class="selectable-item">
				{team.name} :
				{#each listTeamPlayer(team, playersChampionshipStore.list) as player, i}
					{#if i === 0}
						{player.name}
					{:else}
						, {player.name}
					{/if}
				{/each}
			</div>
		{/each}
	{:else}
		<p>Aucune équipe n'est engagée dans la compétition</p>
	{/if}

	<h3>Equipes disponibles</h3>
	<Selector
		id="selectClub"
		bind:value={clubFilter}
		label="Club"
		options={clubsStore.list.map((club) => club.id)}
		optionsLabel={clubsStore.list.map((club) => club.name)}
		unselectedOption="-- Choisis un club --"
	/>
	<Param label="Nom" bind:value={nameFilter} focus={true} oneline={true} />
	{#if filteredTeams.length > 0}
		{#each filteredTeams as team, i}
			<div role="none" onclick={() => engageTeam(i)} class="selectable-item">
				{team.name} :
				{#each listTeamPlayer(team, playersChampionshipStore.list) as player, i}
					{#if i === 0}
						{player.name}
					{:else}
						, {player.name}
					{/if}
				{/each}
			</div>
		{/each}
	{:else}
		<p>Aucune équipe n'est disponible.</p>
		<p>Veuillez créer ou définir de nouvelles équipes ou alléger les filtres ...</p>
	{/if}
</div>
