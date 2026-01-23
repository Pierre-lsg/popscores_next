<script lang="ts">
	import { viewport } from '$lib/stores/viewportStore.svelte';
	import GolfMobile from '$lib/views/quickSession/GolfMobile.svelte';
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
