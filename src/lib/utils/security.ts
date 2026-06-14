import { pb } from './pocketbase/pocketBase';

export const securityCheck = () => {
	if (!pb.authStore.isValid) {
		window.location.href = '/';
	}
};
