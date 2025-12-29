<script lang="ts">
  import { isOnline } from '$lib/stores/networkStore';
  import { fade, slide } from 'svelte/transition';

  let showBackOnline = false;

  // Logique pour afficher brièvement "De retour en ligne"
  $: if ($isOnline) {
    showBackOnline = true;
    setTimeout(() => { showBackOnline = false; }, 3000);
  }
</script>

{#if !$isOnline}
  <div class="banner offline" transition:slide>
    <span>📡 Mode hors-ligne (les scores sont sauvés localement)</span>
  </div>
{:else if showBackOnline}
  <div class="banner online" transition:fade>
    <span>✅ Connexion rétablie</span>
  </div>
{/if}

<style>
  .banner {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    padding: 0.5rem;
    text-align: center;
    font-size: 0.9rem;
    font-weight: bold;
    color: white;
  }
  .offline { background-color: #607d8b; }
  .online { background-color: var(--primary); }
</style>