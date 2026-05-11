import type { Target } from '$lib/types/targetType';

export const getRelativeScore = (
	playerScores: Record<string, number>,
	targets: Target[]
): number => {
	return targets.reduce((acc, target) => {
		const score = playerScores[target.id];
		if (!score) return acc; // Si pas de score saisi, on ignore
		return acc + (score - (target.par || 0));
	}, 0);
};

// On garde aussi le total brut pour l'affichage

export const getTotalStrokes = (
	playerScores: Record<string, number>,
	targets: Target[]
): number => {
	return targets.reduce((acc, target) => {
		return acc + (playerScores[target.id] || 0);
	}, 0);
};

/**
 * Sauvegarde le contenu du localStorage dans un fichier JSON
 * @param fileName Nom du fichier (optionnel)
 */
export const exportLocalStorage = (fileName: string = 'popscores-backup.json') => {
	try {
		const backup: Record<string, string> = {};

		// On parcourt tout le localStorage
		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i);
			if (key) {
				backup[key] = localStorage.getItem(key) || '';
			}
		}

		// Transformation en chaîne JSON (avec indentation pour la lisibilité)
		const dataStr = JSON.stringify(backup, null, 2);

		// Création d'un Blob (Binary Large Object)
		const blob = new Blob([dataStr], { type: 'application/json' });

		// Création d'un lien temporaire pour le téléchargement
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');

		link.href = url;
		link.download = fileName;

		// Simulation du clic et nettoyage
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);

		console.log('Sauvegarde réussie !');
	} catch (error) {
		console.error("Erreur lors de l'export du localStorage :", error);
	}
};

/**
 * Importe un fichier JSON pour restaurer le localStorage
 * @param file Le fichier récupéré via un input type="file"
 */
export const importLocalStorage = async (file: File): Promise<void> => {
	try {
		const text = await file.text();
		const data = JSON.parse(text);

		// 1. Sécurité : On vérifie que c'est bien un objet
		if (typeof data !== 'object' || data === null) {
			throw new Error('Format de fichier invalide');
		}

		// 2. Nettoyage : On vide le localStorage actuel pour repartir propre
		localStorage.clear();

		// 3. Restauration
		Object.keys(data).forEach((key) => {
			localStorage.setItem(key, data[key]);
		});

		// 4. Rechargement : Crucial pour que les stores Svelte captent les nouvelles données
		window.location.reload();
	} catch (error) {
		console.error("Erreur lors de l'import :", error);
	}
};
