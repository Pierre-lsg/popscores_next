export interface User {
	id: string;
	email: string;
	emailVisibility: boolean;
	verified: boolean;
	name: string;
	roles: string[];
	password: string;
}
