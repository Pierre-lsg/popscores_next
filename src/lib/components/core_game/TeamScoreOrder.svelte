<script lang="ts">
	import '$lib/styles/scoreCard.css';

	import type { RankedTeam } from '$lib/types/teamType';
	import type { Target } from '$lib/types/targetType';
	import type { Regulation } from '$lib/types/regulationsType';
	import type { Player } from '$lib/types/playerType';

	import { playersStore } from '$lib/stores/quickSession/playersStore.svelte';
	import { formatPlayerList, getTeamStats } from '$lib/utils/session/golfScoringFunction.svelte';

	let {
		rankedTeams,
		targets,
		players,
		settings
	}: {
		rankedTeams: RankedTeam[];
		targets: Target[];
		players: Player[];
		settings: Regulation;
	} = $props<{
		rankedTeams: RankedTeam[];
		targets: Target[];
		players: Player[];
		settings: Regulation;
	}>();
</script>

<div class="others-list">
	{#each rankedTeams as team, i}
		{@const t = team.team}
		{@const stats = getTeamStats(t, targets, players, settings)}
		<div class="other-item">
			<span class="rank"
				>{team.rank}
				{#if team.isTie}
					*
				{/if}
			</span>
			<span class="podium-name"
				>{t.name} - ({formatPlayerList(
					playersStore.list.filter((p) => t.playersId.includes(p.id)),
					settings
				)})
			</span>
			<span class="podium-score">{stats.gross} ({stats.diff})</span>
		</div>
	{/each}
</div>

<style>
	.podium-name {
		font-size: 1rem;
	}
</style>
