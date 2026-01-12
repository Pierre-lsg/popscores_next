<script lang="ts">
    import { onMount } from 'svelte';
	import type { SessionArchive } from "$lib/types/sessionInterface";

    let history = $state([]);

    onMount(() => {
        const data = localStorage.getItem('golf_history');
/*        if (data) {
            history = JSON.parse(data).sort((a, b) => 
                new Date(b.date).getTime() - new Date(a.date).getTime()
            );
        }*/
    });

	function openSession(session: SessionArchive)
	{
		alert('not yet implemented')
	}
</script>

<div class="history-list">
    {#each history as session}
        <button class="session-card" onclick={() => openSession(session)}>
            <div class="date"></div>
            <div class="details">
				session
            </div>
            <div class="icon">📜</div>
        </button>
    {:else}
        <p>Aucune session archivée pour le moment. ⛳</p>
    {/each}
</div>

<style>
    .history-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding: 16px;
        max-width: 600px;
        margin: 0 auto;
    }

    .session-card {
        display: flex;
        align-items: center;
        background: white;
        border: 1px solid #e0e0e0;
        border-radius: 12px;
        padding: 15px;
        text-align: left;
        cursor: pointer;
        transition: all 0.2s ease;
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        width: 100%;
        color: inherit;
        font-family: inherit;
    }

    .session-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        border-color: #2c3e50;
    }

    .session-card:active {
        transform: translateY(0);
        background-color: #f8f9fa;
    }

    .date {
        font-size: 0.85rem;
        background: #f0f0f0;
        padding: 4px 8px;
        border-radius: 6px;
        color: #666;
        margin-right: 15px;
        font-weight: bold;
        min-width: 80px;
        text-align: center;
    }

    .details {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
    }

    .details strong {
        font-size: 1.1rem;
        color: #2c3e50;
        margin-bottom: 2px;
    }

    .details span {
        font-size: 0.9rem;
        color: #7f8c8d;
    }

    .icon {
        font-size: 1.5rem;
        margin-left: 10px;
        filter: drop-shadow(0 2px 2px rgba(0,0,0,0.1));
    }

    /* Effet "vide" */
    p {
        text-align: center;
        color: #95a5a6;
        margin-top: 40px;
        font-style: italic;
    }
</style>