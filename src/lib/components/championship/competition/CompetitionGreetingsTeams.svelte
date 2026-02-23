<script lang="ts">
	import type { Competition } from '$lib/types/competitionType';
	import type { Course } from '$lib/types/courseType';
	import type { Target } from '$lib/types/targetType';
	import type { Player } from '$lib/types/playerType';
	import type { Team } from '$lib/types/teamType';
	import type { Regulation } from '$lib/types/regulationsType';

	import { getRankedTeams } from '$lib/utils/session/golfScoringFunction.svelte';
	import { coursesChampionshipStore } from '$lib/stores/championship/coursesChampionshipStore.svelte';
	import { playersChampionshipStore } from '$lib/stores/championship/playersChampionshipStore.svelte';
	import { teamsChampionshipStore } from '$lib/stores/championship/teamsChampionshipStore.svelte';
	import TeamScoreCardByTarget from '$lib/ui/TeamScoreCardByTarget.svelte';

	let { currentCompetition = $bindable() } = $props<{
		currentCompetition: Competition | undefined;
	}>();

	let course: Course | undefined = $derived(
		coursesChampionshipStore.find(currentCompetition.courseId)
	);
	let teams: Team[] | undefined = $derived(
		teamsChampionshipStore.list.filter((t) => currentCompetition.teamsId.includes(t.id))
	);
	let players: Player[] | undefined = $derived(
		playersChampionshipStore.list.filter((p) =>
			teams
				.map((t) => t.playersId)
				.flat()
				.includes(p.id)
		)
	);
	let settings: Regulation = {
		hasCrossAFixedPenalty: true,
		malusOverPar: 4,
		malusValue: 10,
		teamGame: true,
		playersPerTeam: 2,
		usePenalizingGhost: false
	};

	let targets: Target[] = $derived(course?.targets || []);

	let rankedTeams = $derived(getRankedTeams(teams, targets, players, settings));
</script>

<div>
	<!-- Affichage de la carte de score -->
	<TeamScoreCardByTarget {rankedTeams} {targets} {players} {settings} />
</div>
