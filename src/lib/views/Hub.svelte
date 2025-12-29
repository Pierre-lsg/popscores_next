<script lang="ts">
  import { currentPage } from '$lib/stores/routerStore';
</script>

<div class="hub-container">
  <h1>What's up Doc ?</h1>
  
  <div class="grid">
    <button class="card" on:click={() => currentPage.set('golf-score')}>
      <span class="icon">⛳</span>
      <h3>Golf Score</h3>
      <p>Suivi de partie entre amis</p>
    </button>

    <button class="card disabled">
      <span class="icon">📈</span>
      <h3>Stats Pro</h3>
      <p>Bientôt disponible...</p>
    </button>
  </div>
</div>

<style>
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
    padding: 1rem;
  }
  .card {
    background: white;
    border: 2px solid #eee;
    border-radius: 12px;
    padding: 1.5rem;
    cursor: pointer;
    transition: transform 0.2s;
  }
  .card:hover { transform: translateY(-5px); border-color: var(--primary); }
  .icon { font-size: 2.5rem; }
  .disabled { opacity: 0.6; cursor: not-allowed; }
</style>