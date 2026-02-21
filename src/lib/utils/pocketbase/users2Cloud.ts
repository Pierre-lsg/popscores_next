import type { User } from '$lib/types/userType';
import { db, pb } from './pocketBase';

export const userService = {
	getAll: () => db.getFullList('users', { sort: 'created' }),

	getByRole: (role: string) =>
		db.getFullList('users', {
			filter: `roles ~ "${role}"`
		}),

	saveUser: (aUser: User) => {
		const userToSave = {
			id: aUser.id,
			email: aUser.email,
			emailVisibility: aUser.emailVisibility,
			verified: aUser.verified,
			name: aUser.name,
			roles: aUser.roles
		};
		db.save('Users', userToSave);
	},

	createUser: (aUser: User) => {
		const userToSave = {
			id: aUser.id,
			email: aUser.email,
			emailVisibility: aUser.emailVisibility,
			verified: aUser.verified,
			name: aUser.name,
			roles: aUser.roles
		};
		db.create('Users', userToSave);
	},

	updateUser: (aUser: User) => {
		const userToSave = {
			id: aUser.id,
			email: aUser.email,
			emailVisibility: aUser.emailVisibility,
			verified: aUser.verified,
			name: aUser.name,
			roles: aUser.roles
		};
		db.update('Users', userToSave);
	}
};
