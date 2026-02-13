<script lang="ts">
	import { onMount } from 'svelte';
	import type { SessionArchive } from '$lib/types/sessionType';

	import HistoryList from '$lib/components/history/HistoryList.svelte';
	import SessionDetails from '$lib/components/history/SessionDetails.svelte';

	let history = $state<SessionArchive[]>([]);
	let currentSession: string = $state('');

	onMount(() => {
		const data = localStorage.getItem('golf-history');
		if (data) {
			history = JSON.parse(data);
		}
	});
</script>

<div class="mobile-wizard">
	{#if currentSession === ''}
		<!-- Liste des sessions historisées en local -->
		<HistoryList title="👥 Liste des sessions passées" bind:currentSession />
	{:else}
		<!-- Details de la session	 -->
		<SessionDetails title="📄 Détails de la session" bind:currentSession />
	{/if}
</div>
