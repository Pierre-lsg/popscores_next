<script lang="ts">
	import Param from '$lib/ui/Param.svelte';
	import Password from '$lib/ui/Password.svelte';
	import { pb } from '$lib/utils/pocketbase/pocketBase';

	interface Props {
		url: string;
		username: string;
		isConnecting: boolean;
	}

	let { url = '', username = '', isConnecting = $bindable(true) }: Props = $props();
	let password: string = $state('');

	const login = async () => {
		try {
			const authData = await pb.collection('users').authWithPassword(username, password);
			console.log('Connecté en tant que : ', pb.authStore.record?.email);
			isConnecting = false;
		} catch (err) {
			alert('Echec à la connexion. Vérifiez vos identifiants.');
			console.log('login', err);
		}
	};
</script>

<div class="container">
	<div class="login-box">
		Serveur : {url}
		<div class="credentials">
			<Param label="Identifiant" type="text" bind:value={username} placeholder="Identifiant" />
			<Password label="Mot de passe" bind:value={password} />
			<div class="action">
				<button onclick={() => login()}>Se connecter</button>
				<button onclick={() => (isConnecting = false)}>Annuler</button>
			</div>
		</div>
	</div>
</div>

<style>
	.action {
		display: flex;
		justify-content: space-between;
		align-items: center;
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

	.login-box {
		display: flex;
		flex-direction: column;
		background-color: var(--bg-card);
		justify-content: center;
		min-height: 30vh;
		width: 100vw;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
	}

	.credentials {
		margin: 2rem;
	}
</style>
