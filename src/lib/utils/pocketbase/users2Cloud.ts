import type { User } from '$lib/types/userType';
import { db } from './pocketBase';

export const userService = {
	getAll: () => db.getFullList<{ data: User }>('users', { sort: 'created' }),

	getByRole: (role: string) =>
		db.getFullList<{ data: User }>('users', {
			filter: `roles ~ "${role}"`
		}),

	getUsersByRole: async (role: string) => {
		let users: User[] = [];
		const cloudUsers = await db.getFullList<{ data: User }>('users', {
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
		const cloudUsers = await db.getFullList<{ data: User }>('users', {
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
		const cloudUsers = await db.getFullList<{ data: User }>('users', {
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

	saveUser: async (aUser: User) => {
		const userToSave = {
			id: aUser.id,
			email: aUser.email,
			emailVisibility: aUser.emailVisibility,
			verified: aUser.verified,
			name: aUser.name,
			roles: aUser.roles
		};
		return await db.save('Users', userToSave);
	},

	createUser: async (aUser: User) => {
		const userToSave = {
			id: aUser.id,
			email: aUser.email,
			emailVisibility: aUser.emailVisibility,
			verified: aUser.verified,
			name: aUser.name,
			roles: aUser.roles
		};
		return await db.create('Users', userToSave);
	},

	updateUser: async (aUser: User) => {
		const userToSave = {
			id: aUser.id,
			email: aUser.email,
			emailVisibility: aUser.emailVisibility,
			verified: aUser.verified,
			name: aUser.name,
			roles: aUser.roles
		};
		return await db.update('Users', userToSave);
	}
};
