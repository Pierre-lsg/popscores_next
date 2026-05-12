<script lang="ts">
	import { historyStore } from '$lib/stores/quickSession/historyStore.svelte';
	import type { SessionArchive } from '$lib/types/sessionType';
	import { historyService } from '$lib/utils/pocketbase/history2Cloud';
	import { userStore } from '$lib/stores/userStore.svelte';
	import { onMount } from 'svelte';

	let allSessions: SessionArchive[] = $state([]);
	let loading = $state(true);
	let knownSessionsId: string[] = $derived(historyStore.list.map((session) => session.id));
	let filteredSessions: SessionArchive[] = $derived(
		allSessions.filter((sessionArchive) => !knownSessionsId.includes(sessionArchive.id))
	);

	let { title = '', currentSession = $bindable('') } = $props<{
		title?: string;
		currentSession: string;
	}>();

	onMount(async () => {
		allSessions = await historyService.getAllSessionArchives();
		loading = false;
	});

	const removeSession = (id: string) => {
		historyStore.removeGame(id);
	};

	const loadSessionfromCloud = (index: number) => {
		const aSession = historyStore.list.filter((s) => s.id === filteredSessions[index].id);
		if (aSession.length == 0) {
			if (confirm('Voulez-vous importer la session ?')) {
				const newArchive = filteredSessions[index];
				historyStore.archiveGame(newArchive);
			}
		}
	};
</script>

<div class="history-list">
	<h2>{title}</h2>
	{#each historyStore.list as session, i}
		<div class="action" style="gap: 10px;">
			<button class="list-card" onclick={() => (currentSession = session.id)}>
				<div class="details">
					{session.settings.locationName}
				</div>
				<div class="details">
					{#if session.settings.regulation.teamGame}👥{:else}👤{/if}
				</div>
				<div>{session.settings.sessionBeginning}</div>
				<div class="icon">📜</div>
			</button>

			<button onclick={() => removeSession(session.id)} class="btn-delete-small">X</button>
		</div>
	{:else}
		<p>Aucune session archivée pour le moment. ⛳</p>
	{/each}

	{#if loading}
		<h3>Sessions disponibles sur le Cloud</h3>
		<p>Chargement ...</p>
	{:else if filteredSessions.length > 0}
		<h3>Sessions disponibles sur le Cloud</h3>
		{#each filteredSessions as session, i}
			<button class="list-card" onclick={() => loadSessionfromCloud(i)}>
				<div>{session.settings.locationName} - {session.settings.sessionBeginning}</div>
			</button>
		{/each}
	{/if}
</div>

<style>
	.history-list {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		gap: 12px;
		width: 100%;
		margin: 0 auto;
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

	p {
		text-align: center;
		color: var(--secondary);
		margin-top: 40px;
		font-style: italic;
	}
</style>
