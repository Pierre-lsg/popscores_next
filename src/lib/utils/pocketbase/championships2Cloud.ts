import { db, pb } from './pocketBase';
import type { Championship } from '$lib/types/championshipType';
import type { MarkedPointScale } from '$lib/types/markedPointScaleType';
import { mpsStore } from '$lib/stores/championship/markedPointScaleStore.svelte';

type CloudChampionshipData = Omit<Championship, 'individualScale' | 'collectiveScale'> & {
	individualScale: MarkedPointScale;
	collectiveScale: MarkedPointScale;
};

export const championshipService = {
	getAll: () => db.getFullList<{ data: CloudChampionshipData }>('championships', { sort: 'created' }),

	getAllChampionships: async () => {
		const championships = await db.getFullList<{ data: CloudChampionshipData }>('championships', { sort: 'created' });
		return championships.map((aChampionship) => ({
			id: aChampionship.data.id,
			name: aChampionship.data.name,
			description: aChampionship.data.description,
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
			cpManagersId: aChampionship.data.cpManagersId,
			supervisorsId: aChampionship.data.supervisorsId
		})) as Championship[];
	},

	getAllChampionshipsScales: async () => {
		const championships = await db.getFullList<{ data: CloudChampionshipData }>('championships', { sort: 'created' });
		const scales: MarkedPointScale[] = [];
		if (Array.isArray(championships)) {
			championships.forEach((aChampionship) => {
				if (aChampionship.data.individualScale) scales.push(aChampionship.data.individualScale);
				if (aChampionship.data.collectiveScale) scales.push(aChampionship.data.collectiveScale);
			});
		}

		return scales;
	},

	getByChampionshipId: (id: string) => db.getOne<{ data: CloudChampionshipData }>('championships', id, {}),

	getChampionshipById: async (id: string) => {
		const championship = await db.getOne<{ data: CloudChampionshipData }>('championships', id, {});
		let aChampionship;
		if (championship)
			aChampionship = {
				id: championship.data.id,
				name: championship.data.name,
				description: championship.data.description,
				season: championship.data.season,
				location: championship.data.location,
				competitionsId: championship.data.competitionsId,
				individualScale: championship.data.individualScale.id,
				collectiveScale: championship.data.collectiveScale.id,
				rankingClubs: championship.data.rankingClubs,
				rankingPlayers: championship.data.rankingPlayers,
				status: championship.data.status,
				maxScoringTeams: championship.data.maxScoringTeams,
				managersId: championship.data.managersId,
				cpManagersId: championship.data.cpManagersId,
				supervisorsId: championship.data.supervisorsId
			};
		return aChampionship;
	},

	save: async (aChampionShip: Championship) => {
		mpsStore.getScaleById(aChampionShip.individualScale);
		const data = {
			id: aChampionShip.id,
			name: aChampionShip.name,
			description: aChampionShip.description,
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
			cpManagersId: aChampionShip.cpManagersId,
			supervisorsId: aChampionShip.supervisorsId
		};

		const championshipToSave = {
			id: aChampionShip.id,
			name: aChampionShip.name,
			owner: pb.authStore.record?.id,
			data: data
		};
		return await db.save('championships', championshipToSave);
	}
};
