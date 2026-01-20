import type { Competition } from '$lib/types/competitionType';

const STORAGE_KEY = 'golf-competitions-data';

class CompetitionsStore {
	list = $state<Competition[]>([]);

	constructor() {
		if (typeof window !== 'undefined') {
			const savedData = localStorage.getItem(STORAGE_KEY);
			this.list = savedData
				? JSON.parse(savedData)
				: [{ id: crypto.randomUUID(), name: 'à définir' }];

			// Sauvegarde automatique à chaque modification sur les compétitions
			$effect.root(() => {
				$effect(() => {
					localStorage.setItem(STORAGE_KEY, JSON.stringify(this.list));
				});
			});
		}
	}

	add(name: string, startDate?: string, scorePublicationDate?: string, location?: string) {
		this.list.push({
			id: crypto.randomUUID(),
			name,
			startDate,
			scorePublicationDate,
			location
		});
	}

	remove(id: string) {
		this.list = this.list.filter((c) => c.id !== id);
	}

	reset() {
		this.list = [];
	}
}

export const competitionsStore = new CompetitionsStore();
