/**
 * Trie un tableau d'objets selon une propriété spécifique
 * @param array Le tableau à trier
 * @param key La clé de l'objet (ex: 'name', 'team')
 * @param ascending Ordre croissant (true) ou décroissant (false)
 */
export const smartSort = <T>(array: T[], key: keyof T, ascending = true): T[] => {
	return [...array].sort((a, b) => {
		const valA = a[key];
		const valB = b[key];

		let comparison = 0;

		// Cas 1 : Nombres (ex: scores, numéros de trous)
		if (typeof valA === 'number' && typeof valB === 'number') {
			comparison = valA - valB;
		}
		// Cas 2 : Dates (si jamais tu ajoutes une date de session)
		else if (valA instanceof Date && valB instanceof Date) {
			comparison = valA.getTime() - valB.getTime();
		}
		// Cas 3 : Texte (ex: noms, équipes)
		else {
			const strA = String(valA || '');
			const strB = String(valB || '');
			comparison = strA.localeCompare(strB, 'fr', {
				sensitivity: 'base',
				numeric: true // Pratique : trie "Trou 2" avant "Trou 10"
			});
		}

		return ascending ? comparison : -comparison;
	});
};

/**
 * Mélange un tableau d'objets
 * @param array Le tableau à trier
 */
export const shuffle = <T>(array: T[]): T[] => {
	const newArray = [...array];

	for (let i = newArray.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[newArray[i], newArray[j]] = [newArray[j], newArray[i]];
	}

	return newArray;
};
