import type { SessionArchive } from '$lib/types/sessionType';
import { db, pb } from './pocketBase';

export const historyService = {
	getAll: () => db.getFullList('sessions', { sort: 'date' }),

	getAllSessionArchives: async () => {
		const sessions = await db.getFullList('sessions', { sort: 'created' });
		return sessions.map((session) => session.data) as SessionArchive[];
	},

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
