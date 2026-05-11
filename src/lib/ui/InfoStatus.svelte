<script lang="ts">
	import { messageStore } from '$lib/stores/appEventStore.svelte';

	let showCsStatus: boolean = $state(false);
</script>

<div class="status-wrapper">
	<div
		role="none"
		class={messageStore.computeStatus()}
		id="flag-status"
		onclick={() => (showCsStatus = !showCsStatus)}
	></div>
</div>

{#if showCsStatus}
	<div class="box-screen">
		<div class="content-box">
			{#if messageStore.list.length > 0}
				<p>Messages :</p>
				<table>
					<tbody>
						{#each messageStore.list as message}
							<tr>
								<td>
									<button
										class="btn-delete-small"
										onclick={() => messageStore.remove(message.keyEvent)}
									>
										X
									</button>
								</td>
								<td class="badge">{message.status}</td>
								<td class="message">{message.details}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			{:else}
				Aucun message
			{/if}
		</div>
	</div>
{/if}

<svelte:window
	onclick={(e) => {
		// If click out of the display area, leave it
		if (
			e.target &&
			!(e.target as Element).closest('.content-box') &&
			(e.target as Element).closest('.box-screen')
		) {
			showCsStatus = false;
		}
	}}
/>

<style>
	.message {
		font-size: 0.9em;
		white-space: normal;
		word-wrap: break-word;
		text-align: left;
	}

	.status-wrapper {
		position: fixed;
		top: 0.5rem;
		right: 4.5rem;
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
</style>
