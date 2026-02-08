import type { Target } from './targetsType';

export interface Course {
	id: string;
	name: string;
	targets: Target[];
}
