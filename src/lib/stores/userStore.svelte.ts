import { pb } from '$lib/utils/pocketbase/pocketBase';
import type { AuthModel } from 'pocketbase';

class UserStore {
	current = $state<AuthModel | null>(pb.authStore.record);

	constructor() {
		pb.authStore.onChange(() => {
			this.current = pb.authStore.record;
		});
	}
}

export const userStore = new UserStore();
