<script lang="ts">
	import { sessionSettingsStore } from '$lib/stores/gameSessionStore.svelte';
	import RankingPodiumSolo from './RankingPodiumSolo.svelte';
	import RankingPodiumTeam from './RankingPodiumTeam.svelte';

	const s = sessionSettingsStore.settings;

	let isTeamGame: boolean = s.teamGame;
</script>

{#if isTeamGame}
	<RankingPodiumTeam />
{:else}
	<RankingPodiumSolo />
{/if}
