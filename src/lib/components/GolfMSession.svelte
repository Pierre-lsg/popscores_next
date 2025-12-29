<script lang="ts">
  import { slide } from 'svelte/transition';

  let locationName = "";
  let weatherCondition = "Soleil"; 
  
  const weatherOptions = ["Soleil", "Nuageux", "Pluie", "Venté", "Froid"];

</script>

<div class="step-content" in:slide>
    <h2>👥 Qui joue ?</h2>
    <div class="setup-fields">
        <div class="field">
        <label for="golf">⛳ Nom du Golf</label>
        <input 
            id="golf" 
            type="text" 
            bind:value={locationName} 
            placeholder="ex: Golf de Toulouse" 
        />
        </div>

        <div class="field">
        <label for="weather">☁️ Météo</label>
        <select id="weather" bind:value={weatherCondition}>
            {#each weatherOptions as option}
            <option value={option}>{option}</option>
            {/each}
        </select>
        </div>
    </div>
</div>

<style>
  .setup-fields {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    background: #f4f4f4;
    padding: 1rem;
    border-radius: 8px;
  }
  input, select {
    padding: 0.8rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
  }
</style>