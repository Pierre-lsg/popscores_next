import LZString from 'lz-string';
import type { Player } from '$lib/types/playerType';
import type { Target } from '$lib/types/targetsType';

export const shareService = {
	// Générer le lien
	generateLink: (players: Player[], targets: Target[]): string => {
		const data = { p: players, h: targets };
		const json = JSON.stringify(data);

		const compressed = LZString.compressToEncodedURIComponent(json);
		return `${window.location.origin}${window.location.pathname}?g=${compressed}`;
	},

	// Lire le lien au chargement
	loadFromUrl: (): { players: Player[]; targets: Target[] } | null => {
		const params = new URLSearchParams(window.location.search);
		const compressedData = params.get('g'); // 'g' pour 'game', plus court

		if (!compressedData) return null;

		try {
			const decompressed = LZString.decompressFromEncodedURIComponent(compressedData);
			if (!decompressed) return null;

			const data = JSON.parse(decompressed);
			return { players: data.p, targets: data.h };
		} catch (e) {
			console.error('Échec de la décompression', e);
			return null;
		}
	}
};
