export const individualRules = ['Individuel', 'Bonus'];
export type individualRules = 'Individuel' | 'Bonus';

export const collectiveRules = [
	'Scramble',
	'Greensome',
	'Chapman',
	'Foursome',
	'4-balls',
	'Team_Bonus',
	'Bonus',
	'Individuel'
];
export type collectiveRule =
	| 'Scramble'
	| 'Greensome'
	| 'Chapman'
	| 'Foursome'
	| '4-balls'
	| 'Team_Bonus'
	| 'Bonus'
	| 'Individuel';

export const rulesCollection = {
	Scramble:
		"Chaque joueur de l'équipe joue sa balle, puis rejoue de la meilleure balle de l'équipe",
	Greensome:
		"Chaque joueur de l'équipe joue sa balle au départ. Ils choisissent la meilleure balle et jouent cette balle alternativement jusqu'à la cible",
	Chapman:
		"Chaque joueur de l'équipe joue sa balle au départ. Poour le deuxième coup, ils jouent la balle du partenaire. Ils choisissent la meilleure balle et jouent alternativement jusqu'à atteindre la cible",
	Foursome: "Chaque joueur de l'équipe joue alternativement une balle jusqu'à la cible",
	'4-balls': "Chaque joueur de l'équipe joue sa balle jusqu'à la cible. On garde le meilleur score",
	Team_Bonus: "Le bonus est compté pour l'équipe",
	Bonus: 'Chaque joueur marque son propre Bonus (en équipe ou en compétition individuelle',
	Individuel: "Chaque joueur de l'équipe joue sa balle jusqu'à la cible"
};

export interface Target {
	id: string;
	par: number;
	name: string;
	rule: string;
	// On pourra ajouter plus tard : distance, gps, etc.
	description: string;
	start_details: string;
	start_pos: { lat: number; lng: number; accuracy: number };
	end_details: string;
	end_pos: { lat: number; lng: number; accuracy: number };
	optional_rules: string;
}
