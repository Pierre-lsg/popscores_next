<script lang="ts">
	import { historyStore } from '$lib/stores/historyStore.svelte';
	import type { SessionSettings } from '$lib/types/gameSessionType';
	import type { SessionArchive } from '$lib/types/sessionType';
	import { getAllSessionsFromPB } from '$lib/utils/pocketbase/pbSessions';
	import { onMount } from 'svelte';

	let allSessions: SessionArchive[] = $state([]);
	let loading = $state(true);

	let { title = '', currentSession = $bindable('') } = $props<{
		title?: string;
		currentSession: string;
	}>();

	onMount(async () => {
		allSessions = await getAllSessionsFromPB();
		loading = false;
	});

	const removeSession = (index: number) => {
		historyStore.removeGame(index);
	};

	const loadSessionfromCloud = (index: number) => {
		// Si la session n'existe pas déjà
		const aSession = historyStore.list.filter((s) => s.id === allSessions[index].id);
		console.log('aSession : ', aSession);
		if (aSession.length == 0) {
			if (confirm('Voulez-vous importer la session ?')) {
				const newArchive = {
					id: allSessions[index].id,
					settings: allSessions[index].settings,
					targets: allSessions[index].targets,
					teams: allSessions[index].teams,
					players: allSessions[index].players
				};

				historyStore.archiveGame(newArchive);
			}
		}
	};
</script>

<div class="history-list">
	<h2>{title}</h2>

	{#each historyStore.list as session, i}
		<button class="session-card" onclick={() => (currentSession = session.id)}>
			<div class="details">
				{session.id} -
				{session.settings.locationName}
			</div>
			<div>{session.settings.sessionBeginning}</div>
			<div class="icon">📜</div>
		</button>
		<button onclick={() => removeSession(i)}> 🗑️ </button>
	{:else}
		<p>Aucune session archivée pour le moment. ⛳</p>
	{/each}

	<h3>Sessions disponibles sur le Cloud</h3>

	{#if loading}
		<p>Chargement ...</p>
	{:else}
		{#each allSessions as session, i}
			<button class="session-card" onclick={() => loadSessionfromCloud(i)}>
				<div>{session.settings.locationName} - {session.settings.sessionBeginning}</div>
			</button>
		{/each}
	{/if}
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
		background: var(--bg-card);
		border: 1px solid #e0e0e0;
		border-radius: 12px;
		padding: 15px;
		text-align: left;
		cursor: pointer;
		transition: all 0.2s ease;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
		width: 100%;
		color: inherit;
		font-family: inherit;
	}

	.session-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		border-color: #2c3e50;
	}

	.session-card:active {
		transform: translateY(0);
		background-color: #f8f9fa;
	}

	.details {
		flex-grow: 1;
		display: flex;
		flex-direction: column;
	}

	.icon {
		font-size: 1.5rem;
		margin-left: 10px;
		filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.1));
	}

	/* Effet "vide" */
	p {
		text-align: center;
		color: #95a5a6;
		margin-top: 40px;
		font-style: italic;
	}
</style>
