<script lang="ts">
	import Param from '$lib/ui/Param.svelte';
	import Password from '$lib/ui/Password.svelte';
	import { pb } from '$lib/utils/pocketbase/pocketBase';

	interface Props {
		url: string;
		username: string;
		password?: string;
		isConnecting: boolean;
	}

	let { url = '', username = '', password = '', isConnecting = $bindable(true) }: Props = $props();
	//let password: string = $state('');

	const login = async () => {
		if (username && !username.includes('@')) {
			username += '@obip.fr';
		}
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

<div class="box-screen">
	<div class="content-box">
		Serveur : {url}
		<div class="credentials">
			<Param label="Identifiant" type="text" bind:value={username} placeholder="Identifiant" />
			<Password label="Mot de passe" bind:value={password} />
			<div class="action">
				<button onclick={() => login()} class="btn btn-primary">Se connecter</button>
				<button onclick={() => (isConnecting = false)} class="btn">Annuler</button>
			</div>
		</div>
	</div>
</div>

<style>
	.credentials {
		margin: 2rem;
	}
</style>
