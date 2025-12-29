<script lang="ts">
  import { onMount } from 'svelte';

  import { playersStore } from '$lib/stores/playersStore';
  import { holesStore } from '$lib/stores/holesStore';
  import { shareService } from '$lib/utils/shareService';
  import { showToast } from '$lib/stores/toastStore';
  import { gameStatus } from '$lib/stores/gameStatusStore';
  import ScoreCard from '$lib/components/ScoreCard.svelte';
  import RankingCard from '$lib/components/RankingCard.svelte';
  import Toast from '$lib/ui/Toast.svelte';

  $: players = $playersStore;
  $: holes = $holesStore;
  $: holeCount = holes.length; 

  function addPlayer() {
    playersStore.add("Joueur #" + (players.length + 1), holeCount);
  }

  function addHole() {
    holesStore.add();
    playersStore.syncAddHole();
  }

  function resetGame() {
    if (confirm("Voulez-vous vraiment recommencer à zéro ?")) {
      playersStore.reset();
      holesStore.reset(); // Assure-toi d'avoir une méthode reset() dans ton holesStore
    }
  }

  function handleNewGame() {
    if (confirm("Commencer une nouvelle partie ?")) {
      // Effacer la partie précédente
      playersStore.reset();
      holesStore.reset(); 
      // Réinitialiser le statut de la partie
      gameStatus.set('setup');
    }
  }

  onMount(() => {
    const importedData = shareService.loadFromUrl();
    if (importedData) {
      if (confirm("Une partie a été trouvée via ce lien. Voulez-vous charger les scores ?")) {
        playersStore.set(importedData.players);
        holesStore.set(importedData.holes);
        // Nettoyer l'URL pour éviter de re-proposer l'import au prochain refresh
        window.history.replaceState({}, '', window.location.pathname);
      }
    }
  });

  async function copyShareLink() {
    try {
      const link = shareService.generateLink($playersStore, $holesStore);
      await navigator.clipboard.writeText(link);
      
      // On déclenche le toast !
      showToast("🔗 Lien de partage copié !");
    } catch (err) {
      showToast("❌ Erreur lors de la copie");
    }
  }
</script>

<main class="container">
  <header>
    <h1>⛳ Golf Score Master</h1>
  </header>
  <div class="game-container { $gameStatus }">
    <header class="status-banner">
      <h2>
        {#if $gameStatus === 'setup'} 📝 Configuration de la partie
        {:else if $gameStatus === 'in_progress'} 🏌️ Partie en cours 🏌️‍♂️
        {:else} 🏆 Résultats
        {/if}
      </h2>
    </header>
  </div>

  <div class="status-bar">
    {#if $gameStatus === 'setup'}
      <div class="actions">
        <button on:click={addPlayer} class="btn btn-primary">Ajouter un Joueur</button>
        <button on:click={addHole} class="btn btn-primary">Ajouter un Trou</button>
        <button on:click={() => gameStatus.set('in_progress')} class="btn btn-start">
          ▶️ Commencer la partie
        </button>
      </div>

    {:else if $gameStatus === 'in_progress'}
      <button on:click={() => gameStatus.set('finished')} class="btn btn-finish">
        🏁 Terminer et figer les scores
      </button>
      <button on:click={() => gameStatus.set('setup')} class="btn btn-text">
        ⚙️ Modifier les joueurs/PARs
      </button>

    {:else}
      <p>Partie terminée ✅</p>
      <button on:click={handleNewGame} class="btn btn-reset">
        🔄 Nouvelle partie
      </button>
    {/if}
  </div>
  
  {#if players.length > 0}
    <ScoreCard bind:players bind:holes {holeCount} />
    
    {#if $gameStatus !== 'setup'}
      <RankingCard {players} />
      {/if}
  {:else}
    <p class="empty-msg">Ajoutez un premier joueur pour commencer la partie.</p>
  {/if}

  <div class="actions">
    <button on:click={resetGame} class="btn btn-secondary">Réinitialiser</button>
    <button on:click={copyShareLink} class="btn btn-share">
      🔗 Partager la partie
    </button>
  </div>

  <Toast />
  

</main>

<style>
  .game-container.setup { border-top: 5px solid var(--status-setup); }
  .game-container.in_progress { border-top: 5px solid var(--status-progress); }
  .game-container.finished { border-top: 5px solid var(--status-finished); }

  .status-banner {
    padding: 1rem;
    background: var(--bg-card);
    margin-bottom: 1rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  }
</style>


