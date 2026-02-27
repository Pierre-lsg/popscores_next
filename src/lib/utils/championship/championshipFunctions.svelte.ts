import { championshipStore } from '$lib/stores/championship/championshipsStore.svelte';
import { userService } from '../pocketbase/users2Cloud';
import type { User } from '$lib/types/userType';

export const getSupervisors = async () => {
	let supervisors: User[] = [];
	let users: any = await userService.getByRole('marshall');

	if (Array.isArray(users)) {
		users.forEach((u) =>
			supervisors.push({
				id: u.id,
				email: '',
				emailVisibility: false,
				verified: true,
				name: u.name,
				roles: []
			})
		);
	}

	return supervisors;
};
