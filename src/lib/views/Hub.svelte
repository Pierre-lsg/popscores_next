<script lang="ts">
	import { appSettings } from '$lib/stores/settingsStore.svelte';
	import { user, pb } from '$lib/utils/pocketbase/pocketBase';
	import { base } from '$app/paths';

	const login = async () => {
		try {
			const authData = await pb
				.collection('users')
				.authWithPassword(appSettings.values.cloudLogin, appSettings.values.cloudPassword);
			console.log('Connecté en tant que : ', pb.authStore.record?.email);
		} catch (err) {
			console.log(err);
		}
	};

	const logout = () => {
		pb.authStore.clear();
	};
</script>

<h1>Bienvenue au {appSettings.values.clubName}</h1>

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
			<a class="card disabled" href="#">
				<span class="icon">👑</span>
				<h3>Championnat</h3>
				<p>Suivi des compétitions</p>
			</a>
		{/if}

		<a class="card" href={base + '/history'}>
			<span class="icon">📜</span>
			<h3>Historique</h3>
			<p>Revoir les sessions précédentes</p>
		</a>

		<a class="card disabled" href="/">
			<span class="icon">📈</span>
			<h3>Stats Pro</h3>
			<p>Bientôt disponible...</p>
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
			<div role="none" class="card" onclick={() => login()}>
				<span class="icon">🔗</span>
				<h3>Connexion</h3>
				<p>Accès aux services et applications en ligne</p>
			</div>
		{/if}
	</div>
</div>

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
