<script lang="ts">
	import { sessionSettingsStore } from '$lib/stores/gameSessionStore.svelte';
	import GolfMPlayerSolo from './golfMPlayer/GolfMPlayerSolo.svelte';
	import GolfMPlayerTeam from './golfMPlayer/GolfMPlayerTeam.svelte';
	import '$lib/styles/golfMPlayer.css';

	const s = sessionSettingsStore.settings;

	let isTeamGame: boolean = s.regulation.teamGame;
</script>

{#if isTeamGame}
	<GolfMPlayerTeam />
{:else}
	<GolfMPlayerSolo />
{/if}
