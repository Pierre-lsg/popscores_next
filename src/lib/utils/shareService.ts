import LZString from 'lz-string';
import type { Player, Hole } from '$lib/types/types';

export const shareService = {
	// Générer le lien
	generateLink: (players: Player[], holes: Hole[]): string => {
		const data = { p: players, h: holes };
		const json = JSON.stringify(data);

		const compressed = LZString.compressToEncodedURIComponent(json);
		return `${window.location.origin}${window.location.pathname}?g=${compressed}`;
	},

	// Lire le lien au chargement
	loadFromUrl: (): { players: Player[]; holes: Hole[] } | null => {
		const params = new URLSearchParams(window.location.search);
		const compressedData = params.get('g'); // 'g' pour 'game', plus court

		if (!compressedData) return null;

		try {
			const decompressed = LZString.decompressFromEncodedURIComponent(compressedData);
			if (!decompressed) return null;

			const data = JSON.parse(decompressed);
			return { players: data.p, holes: data.h };
		} catch (e) {
			console.error('Échec de la décompression', e);
			return null;
		}
	}
};
