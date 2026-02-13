<script lang="ts">
	import { sessionSettingsStore } from '$lib/stores/gameSessionStore.svelte';
	import GolfMScoringSolo from './golfMScoring/GolfMScoringSolo.svelte';
	import GolfMScoringTeam from './golfMScoring/GolfMScoringTeam.svelte';
	import '$lib/styles/golfScoring.css';

	const s = sessionSettingsStore.settings;

	let isTeamGame: boolean = s.teamGame;
</script>

{#if isTeamGame}
	<GolfMScoringTeam />
{:else}
	<GolfMScoringSolo />
{/if}
