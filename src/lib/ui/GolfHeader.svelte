<script lang="ts">
	let {
		title = '',
		onNext,
		onPrev
	} = $props<{
		title?: string;
		onNext?: () => void;
		onPrev?: () => void;
	}>();
	// --
	// Code pour gestion du Swipe
	// Todo: à refactoriser car utilisé ailleurs
	let touchStartX = 0;
	let touchEndX = 0;

	// Seuil minimal pour éviter de changer d'écran par erreur (en pixels)
	const SWIPE_THRESHOLD = 50;

	function handleTouchStart(e: TouchEvent) {
		touchStartX = e.changedTouches[0].screenX;
	}

	function handleTouchEnd(e: TouchEvent) {
		touchEndX = e.changedTouches[0].screenX;
		checkSwipe();
	}

	function checkSwipe() {
		const distance = touchEndX - touchStartX;

		if (Math.abs(distance) > SWIPE_THRESHOLD) {
			if (distance > 0) onNext();
			else onPrev();
		}
	}
	// --
</script>

<div role="none" class="header-section" ontouchstart={handleTouchStart} ontouchend={handleTouchEnd}>
	<h2>{title}</h2>

	<div class="actions">
		{#if onPrev}
			<button class="btn btn-icon" onclick={onPrev}>&lt;&lt;</button>
		{/if}
		{#if onNext}
			<button class="btn btn-icon" onclick={onNext}>&gt;&gt;</button>
		{/if}
	</div>
</div>

<style>
	.header-section {
		background: var(--bg-card);
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		width: 100%;
		margin-top: 0.5rem;
		padding: 0.5rem 0;
		border-radius: 10px;
		margin-bottom: 1rem;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
	}

	.actions {
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 10px;
		height: 60px;
	}

	.btn {
		width: 100%;
		-webkit-tap-highlight-color: transparent;
		user-select: none;
	}

	.btn-icon {
		background: none;
		border: 1px solid var(--primary); /* Ton vert golf */
		color: var(--primary);
		border-radius: 4px;
		padding: 4px 8px;
		margin: 4px 4px 0 0;
		width: 80px;
		font-weight: lighter;
		font-size: 1rem;
		cursor: pointer;
	}
</style>
