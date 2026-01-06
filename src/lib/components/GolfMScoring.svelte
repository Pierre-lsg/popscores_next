<script lang="ts">
	import { sessionSettingsStore } from '$lib/stores/gameSessionStore.svelte';
	import GolfMScoringSolo from './GolfMScoringSolo.svelte';
	import GolfMScoringTeam from './GolfMScoringTeam.svelte';

	const s = sessionSettingsStore.settings;

	let isTeamGame: boolean = s.teamGame;
</script>

{#if isTeamGame}
	<GolfMScoringTeam />
{:else}
	<GolfMScoringSolo />
{/if}
