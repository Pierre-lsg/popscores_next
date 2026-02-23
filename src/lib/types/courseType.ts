import type { Target } from './targetType';

export interface Course {
	id: string;
	name: string;
	targets: Target[];
}
