import { db, pb } from './pocketBase';
import type { Championship, CloudChampionship } from '$lib/types/championshipType';
import type { MarkedPointScale } from '$lib/types/markedPointScaleType';

export const championshipService = {
	getAll: () => db.getFullList('championships', { sort: 'created' }),

	getByChampionshipId: (id: string) => db.getOne('championships', id, {}),

	createChampionship: (
		aChampionShip: Championship,
		idvScale: MarkedPointScale,
		cltScale: MarkedPointScale
	) => {
		const data = {
			id: aChampionShip.id,
			name: aChampionShip.name,
			season: aChampionShip.season,
			location: aChampionShip.location,
			individualScale: idvScale,
			collectiveScale: cltScale
		};
		const championshipToSave = {
			id: aChampionShip.id,
			name: aChampionShip.name,
			owner: pb.authStore.record?.id,
			data: data
		};
		db.save('championships', championshipToSave);
	},

	updateChampionship: (
		aChampionShip: Championship,
		idvScale: MarkedPointScale,
		cltScale: MarkedPointScale
	) => {
		const data = {
			id: aChampionShip.id,
			name: aChampionShip.name,
			season: aChampionShip.season,
			location: aChampionShip.location,
			individualScale: idvScale,
			collectiveScale: cltScale
		};
		const championshipToSave = {
			id: aChampionShip.id,
			name: aChampionShip.name,
			owner: pb.authStore.record?.id,
			data: data
		};
		db.update('championships', championshipToSave);
	}
};
