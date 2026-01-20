<script lang="ts">
	import { onMount } from 'svelte';
	import type { SessionArchive } from '$lib/types/sessionType';
	import type { SessionSettings } from '$lib/types/gameSessionType';

	let history = $state<SessionArchive[]>([]);

	let { title = '', currentSession = $bindable('') } = $props<{
		title?: string;
		currentSession: string;
	}>();

	onMount(() => {
		const data = localStorage.getItem('golf-history');
		if (data) {
			history = JSON.parse(data).sort((a: SessionArchive, b: SessionArchive) =>
				b.settings.sessionBeginning.localeCompare(a.settings.sessionBeginning)
			);
		}
	});
</script>

<div class="history-list">
	<h2>{title}</h2>

	{#each history as session}
		{@const settings: SessionSettings = session.settings}
		<button class="session-card" onclick={() => (currentSession = session.id)}>
			<div class="details">
				{settings.locationName}
			</div>
			<div>{settings.sessionBeginning}</div>
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
