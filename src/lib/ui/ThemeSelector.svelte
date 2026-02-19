<script lang="ts">
	import { themeStore, type Theme } from '$lib/stores/themeStore.svelte';

	let isOpen = $state(false); // État pour gérer l'ouverture

	const themes: { id: Theme; label: string; icon: string }[] = [
		{ id: 'classic', label: 'Classique', icon: '🌿' },
		{ id: 'modern', label: 'Sombre', icon: '🌙' },
		{ id: 'high-contrast', label: 'Soleil', icon: '☀️' },
		{ id: 'warm', label: 'Warm', icon: '🔥' },
		{ id: 'beach', label: 'Beach', icon: '🏖️' }
	];

	// On récupère l'objet du thème actuel pour l'afficher en premier
	let currentThemeObj = $derived(themes.find((t) => t.id === themeStore.current) || themes[0]);

	function selectTheme(id: Theme) {
		themeStore.set(id);
		isOpen = false; // Replie le menu après sélection
	}
</script>

<div class="theme-wrapper">
	<div class="theme-selector" class:expanded={isOpen}>
		<button class="theme-btn active" onclick={() => (isOpen = !isOpen)} title="Changer de thème">
			{currentThemeObj.icon}
		</button>

		{#if isOpen}
			<div
				class="backdrop"
				onclick={() => (isOpen = false)}
				onkeydown={() => (isOpen = false)}
				role="button"
				tabindex="-1"
			></div>

			{#each themes.filter((t) => t.id !== themeStore.current) as t}
				<button class="theme-btn" onclick={() => selectTheme(t.id)} title={t.label}>
					{t.icon}
				</button>
			{/each}
		{/if}
	</div>
</div>

<style>
	.backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: transparent;
		z-index: 999;
	}

	.theme-wrapper {
		position: fixed;
		top: 0.2rem;
		right: 0.5rem;
		z-index: 1000;
	}

	.theme-selector {
		display: flex;
		flex-direction: column; /* Déroulement vertical */
		gap: 0.5rem;
		padding: 0.4rem;
		background: var(--bg-card);
		border: 1px solid var(--border-color);
		border-radius: 50px; /* Look "pilule" une fois ouvert */
		transition: all 0.3s ease;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	/* Quand fermé : pas de bordure ni de fond pour ne voir que l'icône */
	.theme-selector:not(.expanded) {
		background: transparent;
		border-color: transparent;
		box-shadow: none;
	}

	.theme-btn {
		background: var(--bg-card);
		border: 2px solid var(--border-color);
		border-radius: 50%;
		width: 45px; /* Fixe pour mobile pour une cible tactile stable */
		height: 45px;
		cursor: pointer;
		font-size: 1.2rem;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: transform 0.2s ease;
		z-index: 1000;
	}

	.theme-btn:active {
		transform: scale(0.9);
	}

	.theme-btn.active {
		z-index: 2;
		box-shadow: 0 0 10px var(--primary);
	}
</style>
