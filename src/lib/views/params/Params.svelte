<script lang="ts">
	import { appSettings } from '$lib/stores/settingsStore.svelte';
	import Toggle from '$lib/ui/Toggle.svelte';
	import Param from '$lib/ui/Param.svelte';
	import Stepper from '$lib/ui/Stepper.svelte';
	import { toastStore } from '$lib/stores/toastStore.svelte';
	import { pb } from '$lib/utils/pocketbase/pocketBase';
	import { importLocalStorage, exportLocalStorage } from '$lib/utils/utils';

	let fileInput: HTMLInputElement;

	const localReset = () => {
		if (confirm('Voulez-vous supprimer le cache local ?')) localStorage.clear();
		window.location.reload();
	};

	const deepReset = async () => {
		if (confirm("Voulez-vous réinitialiser l'application ?")) {
			// vide le localStorage
			localStorage.clear();

			// Désincrit le Service Worker
			const registrations = await navigator.serviceWorker.getRegistrations();
			for (let registration of registrations) {
				await registration.unregister();
			}

			// Vide les caches de fichiers
			const cacheNames = await caches.keys();
			await Promise.all(cacheNames.map((name) => caches.delete(name)));

			toastStore.show('Application réinitialisée. Redémarrage de Popscores', 'neutral', 5000);
			window.location.reload();
		}
	};

	const updatePocketBaseUrl = () => {
		pb.baseURL = appSettings.values.cloudUrl;
		if (pb.authStore.isValid) pb.authStore.clear();
	};

	const handleFileChange = (event: Event) => {
		const target = event.target as HTMLInputElement;
		if (target.files && target.files[0]) {
			importLocalStorage(target.files[0]);
		}
	};
</script>

<div class="settings-page">
	<h2>Paramètres globaux</h2>
	<Param
		label="Nom du club"
		type="text"
		bind:value={appSettings.values.clubName}
		placeholder="Nom du club"
	/>
	<!--
	<Stepper label="Mon Index (HCP)" bind:value={appSettings.values.hcp} min={0} />
	<Toggle label="Calcul Stableford" bind:checked={appSettings.values.useStableford} />
	-->
	<h2>Paramètres de sessions de golf</h2>

	<Toggle label="Malus fixe en cas de X" bind:checked={appSettings.values.hasCrossAFixedPenalty} />

	{#if appSettings.values.hasCrossAFixedPenalty}
		<Stepper label="Malus fixe" bind:value={appSettings.values.malusValue} />
	{:else}
		<Stepper label="Malus ajouté au par" bind:value={appSettings.values.malusOverPar} />
	{/if}

	<Toggle label="Partie en équipe" bind:checked={appSettings.values.isTeamGame} />

	<h2>Paramètres de sauvegarde Cloud (PocketBase)</h2>

	<Param
		label="URL stockage"
		type="text"
		bind:value={appSettings.values.cloudUrl}
		placeholder="URL du serveur de stockage externe"
		onchange={() => updatePocketBaseUrl()}
	/>
	<Param
		label="Identifiant"
		type="text"
		bind:value={appSettings.values.cloudLogin}
		placeholder="Identifiant"
	/>

	<h2>Import/Export</h2>
	<button onclick={() => exportLocalStorage()}>📥 Exporter backup</button>
	<button onclick={() => fileInput.click()}>📥 Importer Backup</button>
	<input
		bind:this={fileInput}
		type="file"
		accept=".json"
		onchange={handleFileChange}
		style="display: none;"
	/>
	<h2>Réinitialisation</h2>
	<button onclick={() => localReset()}>Réinitialisation des données</button>
	<button onclick={() => deepReset()}>Réinitialisation totale</button>
</div>

<style>
	h2 {
		margin-bottom: 1rem;
		color: var(--primary);
		text-align: center;
	}

	h2:not(:first-child) {
		border-top: var(--primary) 2px solid;
		padding-top: 1rem;
		margin-top: 2rem;
	}

	.settings-page {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}
</style>
