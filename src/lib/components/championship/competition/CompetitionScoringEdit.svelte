<script lang="ts">
	import type { Competition } from '$lib/types/competitionType';
	import type { Fly } from '$lib/types/flyType';
	import type { Course } from '$lib/types/courseType';
	import type { Target } from '$lib/types/targetsType';
	import type { Team } from '$lib/types/teamType';
	import type { Player } from '$lib/types/playerType';
	import type { RankedPlayer } from '$lib/types/playerType';
	import type { Regulations } from '$lib/types/regulationsType';

	import { regulationsStore } from '$lib/stores/championship/regulationsStore.svelte';
	import { coursesChampionshipStore } from '$lib/stores/championship/coursesChampionshipStore.svelte';
	import { teamsChampionshipStore } from '$lib/stores/championship/teamsChampionshipStore.svelte';
	import { playersChampionshipStore } from '$lib/stores/championship/playersChampionshipStore.svelte';

	import TeamScoreCardByTarget from '$lib/ui/TeamScoreCardByTarget.svelte';
	import PlayerScoreCardByTarget from '$lib/ui/PlayerScoreCardByTarget.svelte';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';

	let { currentCompetition = $bindable(), currentFly = $bindable() } = $props<{
		currentCompetition: Competition | undefined;
		currentFly: Fly | undefined;
	}>();

	let rules: Regulations | undefined = $state();
	let course: Course | undefined = $derived(
		coursesChampionshipStore.find(currentCompetition.courseId)
	);
	let teams: Team[] | undefined = $derived(
		teamsChampionshipStore.list.filter((t) => currentFly.teamsId.includes(t.id))
	);
	let players: Player[] | undefined = $derived(
		playersChampionshipStore.list.filter((p) => currentFly.playersId.includes(p.id))
	);
	/*	let rankedPlayer: RankedPlayer = {
		player: undefined,
		rank: 0
	};*/

	onMount(() => {
		if (currentCompetition) {
			if (currentCompetition.regulationsId !== '')
				rules = regulationsStore.find(currentCompetition.regulationsId);
			if (!rules) {
				rules = regulationsStore.new();
				currentCompetition.regulationsId = rules.id;
			}
		}

		console.log('rules', rules);
		console.log('course', course);
		console.log('players', players);
	});
</script>

<div>
	<button onclick={() => (currentFly = undefined)}>Retour</button>
	{#if rules?.teamGame}
		<!-- compétition en équipe
		<TeamScoreCardByTarget rankedTeams course.targets players settings />
-->
		a
		{#each course?.targets as target}
			<div>z{target.name}</div>
		{/each}
	{:else}
		<!-- compétition individuelle
		<PlayerScoreCardByTarget rankedPlayers course?.targets />-->
		b
		{#each course?.targets as target}
			<div>z{target.name}</div>
		{/each}
	{/if}
</div>

<style>
</style>
