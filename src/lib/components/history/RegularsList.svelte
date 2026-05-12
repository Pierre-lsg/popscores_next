<script lang="ts">
	import { confirmStore } from '$lib/stores/confirmStore.svelte';
	import { regularsStore } from '$lib/stores/quickSession/regularPlayersStore.svelte';
	import { toastStore } from '$lib/stores/toastStore.svelte';
	import { shareService } from '$lib/utils/shareService';
	import TextField from '$lib/ui/TextField.svelte';
	import QRCode from '$lib/ui/QRCode.svelte';

	let { title = '' } = $props<{
		title?: string;
	}>();

	let isEditing: boolean[] = $state([]);
	let checkedRegulars = $state(regularsStore.list);
	let qrDataPlayers: string = $state('');

	const removeRegular = async (id: string) => {
		if (await confirmStore.prompt('Voulez-vous supprimer ce joueur ?')) regularsStore.remove(id);
	};

	const copyShareLink = async () => {
		try {
			const link = shareService.generateRegularsLink(checkedRegulars);
			await navigator.clipboard.writeText(link);
			qrDataPlayers = link;

			// On déclenche le toast !
			toastStore.show('🔗 Lien de partage copié !');
		} catch (err) {
			toastStore.show('❌ Erreur lors de la copie');
		}
	};
</script>

<div class="regulars-list">
	<h2>{title}</h2>
	{#each regularsStore.list as regular, i}
		<div class="regular-item">
			<input
				type="checkbox"
				value={regular}
				id={regular.id}
				bind:group={checkedRegulars}
				class="checkbox"
			/>
			<div class="content">
				<TextField bind:value={regular.name} />
			</div>
			<div role="none" onclick={async () => removeRegular(regular.id)} class="btn-delete-small">X</div>
		</div>
	{:else}
		<p>Aucune joueur régulier connu. 👤</p>
	{/each}
	{#if qrDataPlayers !== ''}
		<div role="none" onclick={async () => (qrDataPlayers = '')}>
			<QRCode data={qrDataPlayers} size={400} />
		</div>
	{:else}
		<button onclick={async () => copyShareLink()} class="btn btn-primary">Partager la liste</button>
	{/if}
</div>

<style>
	.checkbox {
		width: 25px;
		height: 25px;
	}

	.regulars-list {
		display: flex;
		flex-direction: column;
		gap: 12px;
		max-width: 600px;
	}

	.regular-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: var(--bg-card);
		border: 1px solid var(--border-color);
		border-radius: 8px;
		padding: 0.5rem;
		touch-action: shadow;
	}
</style>
