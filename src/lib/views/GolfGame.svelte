<script lang="ts">
	import { viewport } from '$lib/stores/viewportStore.svelte';
	import GolfMobile from '$lib/views/golf/GolfMobile.svelte';
	import GolfDesktop from '$lib/views/golf/GolfDesktop.svelte';
	import { gameStatus } from '$lib/stores/gameStatusStore.svelte';
	import { onMount } from 'svelte';
	import { playersStore } from '$lib/stores/playersStore.svelte';
	import { targetsStore } from '$lib/stores/targetsStore.svelte';
	import { teamsStore } from '$lib/stores/teamsStore.svelte';
	import { sessionSettingsStore } from '$lib/stores/gameSessionStore.svelte';

	onMount(() => {
		if (gameStatus.status !== 'setup') {
			if (confirm('Une partie est déjà en cours. Voulez-vous commencer une nouvelle partie ?')) {
				playersStore.reset();
				targetsStore.reset();
				teamsStore.reset();
				sessionSettingsStore.reset();
				gameStatus.reset();
			}
		}
	});
</script>

<div class="game-wrapper">
	{#if viewport.isMobile}
		<GolfMobile />
	{:else}
		<div class="desktop-container">
			Todo : version Desktop
			<GolfMobile />
		</div>
	{/if}
</div>

<style>
	.game-wrapper {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.desktop-container {
		min-width: 800px;
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
	}
</style>
