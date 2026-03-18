import { db, pb } from './pocketBase';
import type { Championship, CloudChampionship } from '$lib/types/championshipType';
import type { MarkedPointScale } from '$lib/types/markedPointScaleType';
import { mpsStore } from '$lib/stores/championship/markedPointScaleStore.svelte';

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
			individualScale: aChampionship.data.individualScale.id,
			collectiveScale: aChampionship.data.collectiveScale.id,
			rankingClubs: aChampionship.data.rankingClubs,
			rankingPlayers: aChampionship.data.rankingPlayers,
			status: aChampionship.data.status,
			maxScoringTeams: aChampionship.data.maxScoringTeams,
			managersId: aChampionship.data.managersId,
			cpManagersId: aChampionship.data.cpManagersId
		})) as Championship[];
	},

	getAllChampionshipsScales: async () => {
		const championships = await db.getFullList('championships', { sort: 'created' });
		let scales: MarkedPointScale[] = [];
		if (Array.isArray(championships)) {
			championships.forEach((aChampionship) => {
				if (aChampionship.data.individualScale) scales.push(aChampionship.data.individualScale);
				if (aChampionship.data.collectiveScale) scales.push(aChampionship.data.collectiveScale);
			});
		}

		return scales;
	},

	getByChampionshipId: (id: string) => db.getOne('championships', id, {}),

	save: (aChampionShip: Championship) => {
		mpsStore.getScaleById(aChampionShip.individualScale);
		const data = {
			id: aChampionShip.id,
			name: aChampionShip.name,
			season: aChampionShip.season,
			location: aChampionShip.location,
			competitionsId: aChampionShip.competitionsId,
			individualScale: mpsStore.getScaleById(aChampionShip.individualScale),
			collectiveScale: mpsStore.getScaleById(aChampionShip.collectiveScale),
			rankingClubs: aChampionShip.rankingClubs,
			rankingPlayers: aChampionShip.rankingPlayers,
			status: aChampionShip.status,
			maxScoringTeams: aChampionShip.maxScoringTeams,
			managersId: aChampionShip.managersId,
			cpManagersId: aChampionShip.cpManagersId
		};

		const championshipToSave = {
			id: aChampionShip.id,
			name: aChampionShip.name,
			owner: pb.authStore.record?.id,
			data: data
		};
		db.save('championships', championshipToSave);
	}
};
