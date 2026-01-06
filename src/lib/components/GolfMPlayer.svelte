<script lang="ts">
	import { sessionSettingsStore } from '$lib/stores/gameSessionStore.svelte';
	import GolfMPlayerSolo from './GolfMPlayerSolo.svelte';
	import GolfMPlayerTeam from './GolfMPlayerTeam.svelte';

	const s = sessionSettingsStore.settings;

	let isTeamGame: boolean = s.teamGame;
</script>

{#if isTeamGame}
	<GolfMPlayerTeam />
{:else}
	<GolfMPlayerSolo />
{/if}
