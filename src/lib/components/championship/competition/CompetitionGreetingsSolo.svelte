<script lang="ts">
	import type { Competition } from '$lib/types/competitionType';
	import type { Player, RankedPlayer } from '$lib/types/playerType';
	import type { Target } from '$lib/types/targetType';
	import type { Course } from '$lib/types/courseType';

	import { playersChampionshipStore } from '$lib/stores/championship/playersChampionshipStore.svelte';
	import { coursesChampionshipStore } from '$lib/stores/championship/coursesChampionshipStore.svelte';
	import { getRankedPlayers } from '$lib/utils/session/golfScoringFunction.svelte';
	import PlayerScoreCardByTarget from '$lib/ui/PlayerScoreCardByTarget.svelte';

	let { currentCompetition = $bindable() } = $props<{
		currentCompetition: Competition | undefined;
	}>();
	let players: Player[] = $derived(
		playersChampionshipStore.list.filter((p) => currentCompetition.playersId.includes(p.id))
	);
	let course: Course | undefined = $derived(
		coursesChampionshipStore.find(currentCompetition.courseId)
	);
	let targets: Target[] = $derived(course?.targets || []);
	let rankedPlayers: RankedPlayer[] = $derived(getRankedPlayers(players, targets || []));
</script>

<div>
	carte de score avec l'ensemble des joueurs

	<!-- Affichage de la carte de score -->
	<PlayerScoreCardByTarget {rankedPlayers} {targets} />
</div>
