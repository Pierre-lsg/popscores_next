<script lang="ts">
  import { currentPage } from '$lib/stores/routerStore';
  
  import Hub from '$lib/views/Hub.svelte';
  import GolfGame from '$lib/views/GolfGame.svelte';
  
  import ThemeSelector from '$lib/ui/ThemeSelector.svelte';
  import NetworkBanner from '$lib/ui/NetworkBanner.svelte';
  // On écoute la page courante
  $: page = $currentPage;
</script>

<NetworkBanner />

<main>

<ThemeSelector />

  {#if page === 'hub'}
    <Hub />
  {:else if page === 'golf-score'}
    <button class="btn btn-back" on:click={() => currentPage.set('hub')}>
      ← Retour au Hub
    </button>
    <GolfGame />
  {/if}
</main>

<style>
  .btn-back {
    margin: 1rem;
    background: none;
    border: none;
    color: var(--primary);
    cursor: pointer;
    font-weight: bold;
  }
</style>