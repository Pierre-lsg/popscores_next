<script lang="ts">
	import { appSettings } from '$lib/stores/settingsStore.svelte';
	import { user, pb } from '$lib/utils/pocketbase/pocketBase';
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
		console.log(params);
		if (params !== null) {
			urlIdent = params.get('ident') || '';
			urlPass = params.get('pass') || '';
			if (urlIdent !== '') isConnecting = true;
		}
	});
</script>

<h1>{appSettings.values.clubName}</h1>

<div class="hub-container">
	<div class="grid-container">
		<a class="card" href={base + '/quickSession'}>
			<span class="icon">⛳</span>
			<h3>Partie rapide</h3>
			<p>Suivi de partie entre amis</p>
		</a>

		{#if $user}
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

		{#if $user}
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
	.grid-container {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		gap: 1rem;
		padding: 0.5rem;
	}

	@media (max-width: 768px) {
		.grid-container {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			gap: 15px;
			padding: 10px;
		}
	}

	.icon {
		font-size: 2.5rem;
	}

	.disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}
</style>
