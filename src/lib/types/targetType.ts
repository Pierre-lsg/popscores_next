export const individualRules = ['Individuel', 'Bonus'];
export type individualRules = 'Individuel' | 'Bonus';

export const collectiveRules = [
	'Scramble',
	'Greensome',
	'Chapman',
	'Foursome',
	'Bonus',
	'Individuel'
];
export type collectiveRule =
	| 'Scramble'
	| 'Greensome'
	| 'Chapman'
	| 'Foursome'
	| 'Bonus'
	| 'Individuel';

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
