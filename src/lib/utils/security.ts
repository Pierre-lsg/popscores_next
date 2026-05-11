import { pb } from './pocketbase/pocketBase';
import { userStore } from '$lib/stores/userStore.svelte';

export const securityCheck = () => {
	if (!pb.authStore.isValid) {
		window.location.href = '/';
	}
};
