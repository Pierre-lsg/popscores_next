import type { SessionArchive } from '$lib/types/sessionType';
import { db, pb } from './pocketBase';

export const historyService = {
	getAll: () => db.getFullList<{ data: SessionArchive }>('sessions', { sort: 'date' }),

	getAllSessionArchives: async () => {
		const sessions = await db.getFullList<{ data: SessionArchive }>('sessions', { sort: 'created' });
		return sessions.map((session) => session.data) as SessionArchive[];
	},

	getByLocation: (location: string) =>
		db.getFullList<{ data: SessionArchive }>('sessions', {
			filter: `location ~ "${location}"`
		}),

	saveSession: async (session: SessionArchive) => {
		const sessionToSave = {
			id: session.id,
			location: session.settings.locationName,
			date: session.settings.sessionBeginning,
			owner: pb.authStore.record?.id,
			data: session
		};

		return await db.save('sessions', sessionToSave);
	}
};
