<script lang="ts">
	import { appSettings } from '$lib/stores/settingsStore.svelte';
	import { pb } from '$lib/utils/pocketbase/pocketBase';
	import { userStore } from '$lib/stores/userStore.svelte';
	import Login from '$lib/components/LoginBox.svelte';
	import { base } from '$app/paths';
	import { onMount } from 'svelte';

	let appSets = $derived(appSettings.values);
	let isConnecting: boolean = $state(false);
	let urlIdent: string = $state('');
	let urlPass: string = $state('');

	const logout = () => {
		pb.authStore.clear();
	};

	const showConnectBox = () => {
		isConnecting = true;
	};

	onMount(() => {
		const params = new URLSearchParams(window.location.search);
		if (params !== null) {
			urlIdent = params.get('ident') || '';
			urlPass = params.get('pass') || '';
			if (urlIdent !== '') isConnecting = true;
		}
	});
</script>

<h1 style="text-align: center; margin-top: 1rem;">{appSettings.values.clubName}</h1>

<div class="hub-container">
	<div class="grid-container">
		<a class="card" href={base + '/quickSession'}>
			<span class="icon">⛳</span>
			<h3>Partie rapide</h3>
			<p>Suivi de partie entre amis</p>
		</a>

		{#if userStore.current}
			<a class="card" href={base + '/championship'}>
				<span class="icon">👑</span>
				<h3>Championnat</h3>
				<p>Suivi des compétitions</p>
			</a>
		{:else}
			<div class="card disabled">
				<span class="icon">👑</span>
				<h3>Championnat</h3>
				<p>Suivi des compétitions</p>
			</div>
		{/if}

		<a class="card" href={base + '/history'}>
			<span class="icon">📜</span>
			<h3>Historique</h3>
			<p>Sessions, joueurs et parcours connus</p>
		</a>

		<a class="card" href={base + '/ranking'}>
			<span class="icon">🏆</span>
			<h3>Résultats</h3>
			<p>Résultats des différents championnats</p>
		</a>

		<a class="card" href={base + '/params'}>
			<span class="icon">⚙️</span>
			<h3>Paramétrages</h3>
			<p>Configuration de l'application</p>
		</a>

		{#if userStore.current}
			<div role="none" class="card" onclick={() => logout()}>
				<span class="icon">👋</span>
				<h3>Déconnexion</h3>
				<p>Arrivederci ...</p>
			</div>
		{:else}
			<div role="none" class="card" onclick={() => showConnectBox()}>
				<span class="icon">🔗</span>
				<h3>Connexion</h3>
				<p>Accès aux services et applications en ligne</p>
			</div>
		{/if}
	</div>
</div>

{#if isConnecting}
	{#if urlIdent !== ''}
		<Login url={appSets.cloudUrl} username={urlIdent} password={urlPass} bind:isConnecting />
	{:else}
		<Login url={appSets.cloudUrl} username={appSets.cloudLogin} bind:isConnecting />
	{/if}
{/if}

<style>
	.hub-container {
		display: flex;
		justify-content: center;
		padding: 1rem;
		width: 100%;
		box-sizing: border-box;
	}

	.grid-container {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 2rem;
		width: 100%;
		max-width: 900px; /* Limite la largeur sur PC pour garder un aspect dashboard */
	}

	.card {
		padding: 2rem 1rem; /* Plus d'espace intérieur sur PC */
		min-height: 180px;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.icon {
		font-size: 3.5rem;
		margin-bottom: 0.5rem;
		filter: drop-shadow(0 4px 4px rgba(0,0,0,0.2));
	}

	h3 {
		font-size: 1.3rem;
		margin: 0;
	}

	p {
		font-size: 0.95rem;
		opacity: 0.8;
		margin: 0;
	}

	@media (max-width: 1024px) {
		.grid-container {
			gap: 1.5rem;
		}
	}

	@media (max-width: 768px) {
		.grid-container {
			grid-template-columns: repeat(2, 1fr);
			gap: 1rem;
		}
		
		.card {
			padding: 1.5rem 0.5rem;
			min-height: 150px;
		}

		.icon {
			font-size: 2.8rem;
		}
	}

	@media (max-width: 380px) {
		.grid-container {
			gap: 0.8rem;
		}
	}

	.disabled {
		opacity: 0.5;
		cursor: not-allowed;
		filter: grayscale(1);
	}
</style>
