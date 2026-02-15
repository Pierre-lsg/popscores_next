import { db, pb } from './pocketBase';

export const historyService = {
	getAll: () => db.getFullList('sessions', { sort: 'date' }),

	getByLocation: (location: string) =>
		db.getFullList('sessions', {
			filter: `location ~ "${location}"`
		}),

	saveSession: (session: any) => {
		const sessionToSave = {
			id: session.id,
			location: session.settings.locationName,
			date: session.settings.sessionBeginning,
			owner: pb.authStore.record?.id,
			data: session
		};

		db.save('sessions', sessionToSave);
	}
};
