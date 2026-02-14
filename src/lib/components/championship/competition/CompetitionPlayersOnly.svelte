<script lang="ts">
	import type { Competition } from '$lib/types/competitionType';
	import type { Player } from '$lib/types/playerType';
	import { getFilteredPlayers } from '$lib/utils/championship/competitionsFunctions.svelte';

	import { playersChampionshipStore } from '$lib/stores/championship/playersChampionshipStore.svelte';
	import { clubsStore } from '$lib/stores/championship/clubsStore.svelte';

	import Param from '$lib/ui/Param.svelte';
	import Selector from '$lib/ui/Selector.svelte';

	let { currentCompetition = $bindable() } = $props<{
		currentCompetition: Competition | undefined;
	}>();

	let clubFilter: string = $state('');
	let nameFilter: string = $state('');
	let addingPlayer: boolean = $state(false);
	let newPlayersName: string = $state('');
	let newPlayersClub: string = $state('');

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

	const engagePlayer = (index: number) => {
		currentCompetition.playersId.push(filteredPlayers[index].id);
	};

	const disengagePlayer = (index: number) => {
		currentCompetition.playersId = currentCompetition.playersId.filter(
			(id: string) => id !== competitionPlayers[index].id
		);
	};

	const addPlayer = () => {
		playersChampionshipStore.add(newPlayersName, '', '', newPlayersClub);
	};
</script>

<div>
	<!-- Compétition individuelle -->
	<h3>Joueurs engagés</h3>
	{#if competitionPlayers.length > 0}
		{#each competitionPlayers as player, i}
			<div role="none" onclick={() => disengagePlayer(i)} class="selectable-item">
				{player.name}
			</div>
		{/each}
	{:else}
		<p>Aucun joueur n'est engagé dans la compétition</p>
	{/if}

	<h3>Joueurs disponibles</h3>
	<Selector
		id="selectClub"
		bind:value={clubFilter}
		label="Club"
		options={clubsStore.list.map((club) => club.id)}
		optionsLabel={clubsStore.list.map((club) => club.name)}
		unselectedOption="-- Tous les clubs --"
	/>
	<Param label="Nom" bind:value={nameFilter} oneline={true} />
	{#if filteredPlayers.length > 0}
		{#each filteredPlayers as player, i}
			<div role="none" onclick={() => engagePlayer(i)} class="selectable-item">
				{player.name}
			</div>
		{/each}
	{:else}
		<p>Aucun joueur n'est disponible.</p>
		<p>Veuillez créer de nouveaux joueurs ou alléger les filtres ...</p>
	{/if}

	<h3>
		Ajouter un nouveau joueur ... <button onclick={() => (addingPlayer = !addingPlayer)}
			>&nbsp;+&nbsp;</button
		>
	</h3>
	{#if addingPlayer}
		<Param label="Nom" bind:value={newPlayersName} />
		<Selector
			id="selectClub"
			bind:value={newPlayersClub}
			label="Club"
			options={clubsStore.list.map((club) => club.id)}
			optionsLabel={clubsStore.list.map((club) => club.name)}
			unselectedOption="sans club"
		/>
		<button onclick={addPlayer}>Valider</button>
		<button onclick={() => (addingPlayer = false)}>Annuler</button>
	{/if}
</div>
