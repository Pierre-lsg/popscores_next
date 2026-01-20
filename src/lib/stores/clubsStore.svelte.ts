import type { Club } from '$lib/types/clubType';

const STORAGE_KEY = 'golf-clubs-data';

class ClubsStore {
	list = $state<Club[]>([]);

	constructor() {
		if (typeof window !== 'undefined') {
			const savedData = localStorage.getItem(STORAGE_KEY);
			this.list = savedData
				? JSON.parse(savedData)
				: [{ id: crypto.randomUUID(), name: 'à définir' }];

			// Sauvegarde automatique à chaque modification sur les clubs
			$effect.root(() => {
				$effect(() => {
					localStorage.setItem(STORAGE_KEY, JSON.stringify(this.list));
				});
			});
		}
	}

	add(name: string, description?: string, playersId: string[] = [], teamsId: string[] = []) {
		this.list.push({
			id: crypto.randomUUID(),
			name,
			description,
			playersId,
			teamsId
		});
	}

	remove(id: string) {
		this.list = this.list.filter((c) => c.id !== id);
	}

	reset() {
		this.list = [];
	}
}

export const clubsStore = new ClubsStore();
