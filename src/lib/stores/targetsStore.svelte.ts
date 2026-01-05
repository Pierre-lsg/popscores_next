import type { Target } from '$lib/types/targetsInterface';

const STORAGE_KEY = 'golf-targets-data';

class TargetsStore {
	// On initialise avec une liste vide, puis on charge le localStorage dans le constructeur
	list = $state<Target[]>([]);

	constructor() {
		if (typeof window !== 'undefined') {
			const savedData = localStorage.getItem(STORAGE_KEY);
			this.list = savedData ? JSON.parse(savedData) : [{ id: crypto.randomUUID(), par: 4 }];

			// Sauvegarde automatique à chaque modification de la liste ou d'un par
			$effect.root(() => {
				$effect(() => {
					localStorage.setItem(STORAGE_KEY, JSON.stringify(this.list));
				});
			});
		}
	}

	add(par: number, name: string, rule: string) {
		this.list.push({
			id: crypto.randomUUID(),
			par: Number(par) || 0,
			name,
			rule
		});
	}

	// Version simplifiée : on peut modifier directement l'objet !
	updatePar(index: number, newPar: number) {
		if (this.list[index]) {
			this.list[index].par = Number(newPar) || 0;
		}
	}

	moveTarget(fromIndex: number, toIndex: number) {
		const item = this.list[fromIndex];
		this.list.splice(fromIndex, 1); // Retire
		this.list.splice(toIndex, 0, item); // Insère
	}

	addTarget() {
		this.list.push({
			id: crypto.randomUUID(), // Identifiant unique stable
			par: 3,
			rule: 'Greensome'
		});
	}

	remove(index: number) {
		this.list.splice(index, 1);
	}

	reset() {
		this.list = [{ id: crypto.randomUUID(), par: 4 }];
	}
}

export const targetsStore = new TargetsStore();
