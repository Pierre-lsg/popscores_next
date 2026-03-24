import LZString from 'lz-string';
import type { Player } from '$lib/types/playerType';
import type { Target } from '$lib/types/targetType';
import type { Course } from '$lib/types/courseType';

// Generic function to handle compression/decompression
const handleDataFromUrl = <T>(paramName: string, key: string): T | null => {
	const params = new URLSearchParams(window.location.search);
	const compressedData = params.get(paramName);

	if (!compressedData) return null;

	try {
		const decompressed = LZString.decompressFromEncodedURIComponent(compressedData);
		if (!decompressed) return null;

		const data = JSON.parse(decompressed);
		return data[key] as T;
	} catch (e) {
		console.error('Échec de la décompression', e);
		return null;
	}
};

// Generic function to handle compression for sharing
const handleDataForUrl = <T>(data: T, paramName: string, key: string): string => {
	const dataToCompress = { [key]: data };
	const json = JSON.stringify(dataToCompress);
	const compressed = LZString.compressToEncodedURIComponent(json);
	return `${window.location.origin}${window.location.pathname}?${paramName}=${compressed}`;
};

export const shareService = {
	// Generate link for players and targets
	generateLink: (players: Player[], targets: Target[]): string => {
		return handleDataForUrl({ p: players, h: targets }, 'g', 'g');
	},

	// Load players and targets from URL
	loadFromUrl: (): { players: Player[]; targets: Target[] } | null => {
		const players = handleDataFromUrl<Player[]>('g', 'p');
		const targets = handleDataFromUrl<Target[]>('g', 'h');

		if (players && targets) {
			return { players, targets };
		}

		return null;
	},

	// Generate link for course
	generateCourseLink: (course: Course): string => {
		return handleDataForUrl(course, 'c', 'c');
	},

	// Load course from URL
	loadCourseFromUrl: (): { course: Course } | null => {
		const course = handleDataFromUrl<Course>('c', 'c');
		return course ? { course } : null;
	},

	// Generate link for players
	generateRegularsLink: (regulars: Player[]): string => {
		return handleDataForUrl(regulars, 'r', 'r');
	},

	// Load players from URL
	loadRegularsFromUrl: (): Player[] | [] => {
		const regulars = handleDataFromUrl<Player[]>('r', 'r');
		return regulars ? regulars : [];
	}
};
