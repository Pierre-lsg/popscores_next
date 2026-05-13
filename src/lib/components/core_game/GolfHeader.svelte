<script lang="ts">
	import { swipe } from '$lib/utils/swipe';
	import { onMount } from 'svelte';

	let {
		title = '',
		onNext,
		onPrev
	} = $props<{
		title?: string;
		onNext?: () => void;
		onPrev?: () => void;
	}>();

	let isFixed: string = $state('');

	window.addEventListener('scroll', function () {
		if (window.scrollY > 55) isFixed = 'fixed';
		else isFixed = '';
	});

	onMount(() => {
		if (window.scrollY > 55) isFixed = 'fixed';
		else isFixed = '';
	});
</script>

<div role="none" class="header-section {isFixed}" use:swipe={{ onRight: onNext, onLeft: onPrev }}>
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
		z-index: 100;
		justify-content: space-between;
		align-items: flex-start;
		width: 100%;
		margin-top: 0.5rem;
		padding: 0.5rem 0;
		border-radius: 10px;
		margin-bottom: 1rem;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
	}

	.header-section.fixed {
		position: sticky;
		top: 7vh;
		left: 0;
		width: 100%;
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
</style>
