import { db, pb } from './pocketBase';
import type { Championship, CloudChampionship } from '$lib/types/championshipType';
import type { MarkedPointScale } from '$lib/types/markedPointScaleType';

export const championshipService = {
	getAll: () => db.getFullList('championships', { sort: 'created' }),

	getAllChampionships: async () => {
		const championships = await db.getFullList('championships', { sort: 'created' });
		return championships.map((aChampionship) => ({
			id: aChampionship.data.id,
			name: aChampionship.data.name,
			season: aChampionship.data.season,
			location: aChampionship.data.location,
			competitionsId: aChampionship.data.competitionsId,
			individualScale: aChampionship.idvScale.id,
			collectiveScale: aChampionship.cltScale.id
		})) as Championship[];
	},

	getByChampionshipId: (id: string) => db.getOne('championships', id, {}),

	saveChampionship: (
		aChampionShip: Championship,
		idvScale?: MarkedPointScale,
		cltScale?: MarkedPointScale
	) => {
		const data = {
			id: aChampionShip.id,
			name: aChampionShip.name,
			season: aChampionShip.season,
			location: aChampionShip.location,
			competitionsId: aChampionShip.competitionsId,
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

	createChampionship: (
		aChampionShip: Championship,
		idvScale?: MarkedPointScale,
		cltScale?: MarkedPointScale
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
		db.create('championships', championshipToSave);
	},

	updateChampionship: (
		aChampionShip: Championship,
		idvScale?: MarkedPointScale,
		cltScale?: MarkedPointScale
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
