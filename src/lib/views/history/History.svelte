<script lang="ts">
	import HistoryList from '$lib/components/history/HistoryList.svelte';
	import HistoryDetails from '$lib/components/history/HistoryDetails.svelte';

	let currentSession: string = $state('');
</script>

<div class="mobile-wizard">
	{#if currentSession === ''}
		<!-- Liste des sessions historisées en local -->
		<HistoryList title="👥 Liste des sessions passées" bind:currentSession />
	{:else}
		<!-- Details de la session	 -->
		<HistoryDetails title="📄 Détails de la session" bind:currentSession />
	{/if}
</div>
