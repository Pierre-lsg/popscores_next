<script lang="ts">
	import { onMount } from 'svelte';
	import { statusStore } from '$lib/stores/appEventStore.svelte';

	let showStatus: boolean = $state(false);

	// Définir les éléments ducomposant status
	onMount(() => {
		statusStore.reset();
		statusStore.add('editChamp', 'nothing', 'Message de test. A supprimer');
	});
</script>

<div class="status-wrapper">
	<div
		role="none"
		class="nothing"
		id="flag-status"
		onclick={() => (showStatus = !showStatus)}
	></div>
</div>

{#if showStatus}
	<div class="container">
		<div class="displayed-box">
			<p>Messages :</p>
			{#each statusStore.list as message}
				<div>
					<span class="badge">{message.status}</span> - {message.details}
				</div>
			{/each}
		</div>
	</div>
{/if}

<style>
	.status-wrapper {
		position: fixed;
		top: 0.7rem;
		right: 5.5rem;
		z-index: 1000;
	}

	#flag-status {
		width: 20px;
		height: 20px;
		border-radius: 50%;
		box-shadow: 0 4px 12px black;
	}

	.badge {
		background: var(--primary-light);
		color: var(--primary);
		border-radius: 4px;
		font-weight: bold;
	}

	.container {
		display: flex;
		flex-direction: column;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 999;
		align-items: center;
		justify-content: center;
		height: 100vh;
		width: 100vw;
		margin: 0;
		background-color: rgba(0, 0, 0, 0.6);
	}

	.displayed-box {
		display: flex;
		flex-direction: column;
		background-color: var(--bg-card);
		justify-content: center;
		min-height: 30vh;
		width: 100vw;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
	}

	.btn-close {
		position: absolute;
		top: 10px;
		right: 10px;
		width: 3vh;
		height: 3vh;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: bolder;
		border-radius: 50%;
		background-color: var(--bg-card);
		color: var(--primary);
	}
</style>
