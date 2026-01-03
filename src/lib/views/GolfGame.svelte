<script lang="ts">
	import { isMobile } from '$lib/stores/viewportStore';
	import GolfMobile from '$lib/views/golf/GolfMobile.svelte';
	import GolfDesktop from '$lib/views/golf/GolfDesktop.svelte';
</script>

<div class="game-wrapper">
	{#if $isMobile}
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
