<script lang="ts">
	import { themeStore, type Theme } from '$lib/stores/themeStore.svelte';

	// Plus besoin de onMount ! Le store s'en occupe dès qu'il est importé.

	const themes: { id: Theme; label: string; icon: string }[] = [
		{ id: 'classic', label: 'Classique', icon: '🌿' },
		{ id: 'modern', label: 'Sombre', icon: '🌙' },
		{ id: 'high-contrast', label: 'Soleil', icon: '☀️' },
		{ id: 'warm', label: 'Warm', icon: '🔥' },
		{ id: 'beach', label: 'Beach', icon: '🏖️' }
	];
</script>

<div class="theme-selector">
	{#each themes as t}
		<button
			class="theme-btn"
			class:active={themeStore.current === t.id}
			onclick={() => themeStore.set(t.id)}
			title={t.label}
		>
			{t.icon}
		</button>
	{/each}
</div>

<style>
	/* Le style reste identique, il est déjà parfait ! */
	.theme-selector {
		display: flex;
		gap: 0.5rem;
		padding: 0.5rem;
	}
	.theme-btn {
		background: var(--bg-card);
		border: 2px solid var(--border-color);
		border-radius: 50%;
		width: 4.5vh;
		height: 4.5vh;
		cursor: pointer;
		font-size: 1.2rem;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s;
	}
	.theme-btn.active {
		border-color: var(--border-color);
		transform: scale(1.1);
		box-shadow: 0 0 8px var(--primary);
	}
</style>
