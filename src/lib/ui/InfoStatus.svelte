<script lang="ts">
	import { messageStore } from '$lib/stores/appEventStore.svelte';

	let showStatus: boolean = $state(false);
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
			{#if messageStore.list.length > 0}
				<p>Messages :</p>
				{#each messageStore.list as message}
					<div>
						<span class="badge">{message.status}</span> - {message.details}
					</div>
				{/each}
			{:else}
				Aucun message
			{/if}
		</div>
	</div>
{/if}

<svelte:window
	onclick={(e) => {
		// If click out of the display area, leave it
		if (e.target && (e.target as Element).closest('.displayed-box')) {
			showStatus = !showStatus;
		}
	}}
/>

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
