<script lang="ts">
	import Param from '$lib/ui/Param.svelte';
	import Password from '$lib/ui/Password.svelte';
	import { pb } from '$lib/utils/pocketbase/pocketBase';
	import { toastStore } from '$lib/stores/toastStore.svelte';
	import { fade, scale } from 'svelte/transition';

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
			await pb.collection('users').authWithPassword(username, password);
			console.log('Connecté en tant que : ', pb.authStore.record?.email);
			isConnecting = false;
		} catch (err) {
			toastStore.show('Echec à la connexion. Vérifiez vos identifiants.', 'failure', 0);
			console.log('login', err);
		}
	};
</script>

<div class="modal-backdrop" transition:fade={{ duration: 200 }}>
	<div class="modal-box" transition:scale={{ start: 0.95, duration: 200 }}>
		<h3 class="modal-title">Connexion à PocketBase</h3>
		<p class="text-sm">Serveur : {url}</p>
		<div class="credentials">
			<Param label="Identifiant" type="text" bind:value={username} placeholder="Identifiant" />
			<Password label="Mot de passe" bind:value={password} />
			<div class="modal-actions" style="margin-top: 1.5rem; display: flex; justify-content: space-around; gap: 1rem;">
				<button onclick={() => login()} class="btn btn-primary">Se connecter</button>
				<button onclick={() => (isConnecting = false)} class="btn btn-secondary">Annuler</button>
			</div>
		</div>
	</div>
</div>

<style>
	.credentials {
		margin: 2rem;
	}
</style>
