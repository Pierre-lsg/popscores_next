<script lang="ts">
	import { sessionSettingsStore } from '$lib/stores/gameSessionStore.svelte';
	import RankingPodiumSolo from './rankingPodium/RankingPodiumSolo.svelte';
	import RankingPodiumTeam from './rankingPodium/RankingPodiumTeam.svelte';
	import '$lib/styles/rankingPodium.css';

	const s = sessionSettingsStore.settings;

	let isTeamGame: boolean = s.regulation.teamGame;
</script>

{#if isTeamGame}
	<RankingPodiumTeam />
{:else}
	<RankingPodiumSolo />
{/if}
