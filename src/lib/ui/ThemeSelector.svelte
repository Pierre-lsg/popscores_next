<script lang="ts">
  import { theme, type Theme } from '$lib/stores/themeStore';
  import { onMount } from 'svelte';

  // Au chargement, on s'assure que l'attribut HTML est bien là
  onMount(() => {
    document.documentElement.setAttribute('data-theme', $theme);
  });

  const themes: { id: Theme; label: string; icon: string }[] = [
    { id: 'classic', label: 'Classique', icon: '🌿' },
    { id: 'modern', label: 'Sombre', icon: '🌙' },
    { id: 'high-contrast', label: 'Soleil', icon: '☀️' }
  ];
</script>

<div class="theme-selector">
  {#each themes as t}
    <button 
      class="theme-btn" 
      class:active={$theme === t.id}
      on:click={() => theme.set(t.id)}
      title={t.label}
    >
      {t.icon}
    </button>
  {/each}
</div>

<style>
  .theme-selector {
    display: flex;
    gap: 0.5rem;
    padding: 1rem;
  }
  .theme-btn {
    background: var(--bg-card);
    border: 2px solid var(--border-color);
    border-radius: 50%;
    width: 40px;
    height: 40px;
    cursor: pointer;
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  }
  .theme-btn.active {
    border-color: var(--primary);
    transform: scale(1.1);
    box-shadow: 0 0 8px var(--primary);
  }
</style>