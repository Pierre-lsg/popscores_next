<script lang="ts">
  import { toast } from '$lib/stores/toastStore';
  import { fade, fly } from 'svelte/transition';
</script>

{#if $toast}
  <div 
    class="toast-container" 
    in:fly={{ y: 50, duration: 400 }} 
    out:fade
  >
    <div class="toast-content">
      <span>{$toast}</span>
    </div>
  </div>
{/if}

<style>
  .toast-container {
    position: fixed;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;
  }

  .toast-content {
    background: #333;
    color: white;
    padding: 0.8rem 1.5rem;
    border-radius: 50px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
</style>