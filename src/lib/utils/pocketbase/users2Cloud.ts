import type { User } from '$lib/types/userType';
import { db } from './pocketBase';

export const userService = {
	getAll: () => db.getFullList('users', { sort: 'created' }),

	getByRole: (role: string) =>
		db.getFullList('users', {
			filter: `roles ~ "${role}"`
		}),

	getUsersByRole: async (role: string) => {
		let users: User[] = [];
		const cloudUsers: any = await db.getFullList('users', {
			filter: `roles ~ "${role}"`
		});
		if (Array.isArray(cloudUsers)) {
			cloudUsers.forEach((u) =>
				users.push({
					id: u.id,
					email: u.email,
					emailVisibility: false,
					verified: true,
					name: u.name,
					roles: [],
					password: ''
				})
			);
		}
		return users;
	},

	getUsersByRoleAndChampionship: async (role: string, cs: string) => {
		let users: User[] = [];
		const cloudUsers: any = await db.getFullList('users', {
			filter: `roles ~ "${role}" && championships ~ "${cs}"`
		});
		if (Array.isArray(cloudUsers)) {
			cloudUsers.forEach((u) =>
				users.push({
					id: u.id,
					email: u.email,
					emailVisibility: false,
					verified: true,
					name: u.name,
					roles: [],
					password: ''
				})
			);
		}
		return users;
	},

	getUsersByChampionship: async (cs: string) => {
		let users: User[] = [];
		const cloudUsers: any = await db.getFullList('users', {
			filter: `championships ~ "${cs}"`
		});
		if (Array.isArray(cloudUsers)) {
			cloudUsers.forEach((u) =>
				users.push({
					id: u.id,
					email: u.email,
					emailVisibility: false,
					verified: true,
					name: u.name,
					roles: [],
					password: ''
				})
			);
		}
		return users;
	},

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
