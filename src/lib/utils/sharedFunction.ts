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
				numeric: true // Pratique : trie "Cible 2" avant "Cible 10"
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

export const formatList = (list: string[]): string => {
	// On crée le formateur pour le français
	const formatter = new Intl.ListFormat('fr', {
		style: 'long',
		type: 'conjunction'
	});

	return formatter.format(list);
};

export interface GPSCoords {
	lat: number;
	lng: number;
	accuracy: number;
}

export const getGPS = (): Promise<GPSCoords> => {
	return new Promise((resolve, reject) => {
		if (!navigator.geolocation) {
			reject("La géolocalisation n'est pas supportée par votre navigateur");
		}

		navigator.geolocation.getCurrentPosition(
			(position) => {
				resolve({
					lat: position.coords.latitude,
					lng: position.coords.longitude,
					accuracy: position.coords.accuracy // Précision en mètres
				});
			},
			(error) => {
				reject(error.message);
			},
			{
				enableHighAccuracy: true, // Force l'utilisation du GPS (plus précis que le Wi-Fi)
				timeout: 5000, // Temps max d'attente
				maximumAge: 0 // Ne pas utiliser de position en cache
			}
		);
	});
};

export function calculateDistance(pos1: GPSCoords, pos2: GPSCoords): number {
	// 1 degré de latitude vaut environ 111 111 mètres
	const latMetres = (pos2.lat - pos1.lat) * 111111;

	// Pour la longitude, la distance entre deux méridiens rétrécit quand on monte vers le nord
	// On multiplie par le cosinus de la latitude moyenne
	const avgLat = (pos1.lat + pos2.lat) / 2;
	const lngMetres = (pos2.lng - pos1.lng) * 111111 * Math.cos((avgLat * Math.PI) / 180);

	// On applique Pythagore : a² + b² = c²
	return Math.sqrt(latMetres * latMetres + lngMetres * lngMetres);
}

/**
 * Lance la reconnaissance vocale et retourne le texte dicté
 * @returns Promise<string>
 */
export const toggleDictation = (recognition: any, isListening: boolean): Promise<string> => {
	return new Promise((resolve, reject) => {
		if (!isListening) {
			if (recognition) recognition.stop();
			console.log("fin d'enregistrement");
			return;
		}

		// Gestion de la compatibilité (préfixes selon les navigateurs)
		const SpeechRecognition =
			(window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

		if (!SpeechRecognition) {
			reject('Désolé, votre navigateur ne supporte pas la dictée vocale.');
			return;
		}

		recognition = new SpeechRecognition();

		// Configuration
		recognition.lang = 'fr-FR';
		recognition.interimResults = false; // On ne veut que le résultat final
		recognition.maxAlternatives = 1;
		recognition.continuous = false; // On s'arrête après une phrase, ou au stop()

		recognition.onresult = (event: any) => {
			const transcript = event.results[0][0].transcript;
			// Petite touche de propreté : majuscule au début
			const cleanText = transcript.charAt(0).toUpperCase() + transcript.slice(1);
			resolve(cleanText);
		};

		recognition.onend = () => {
			recognition = null;
		};

		recognition.onerror = (event: any) => {
			if (event.error === 'no-speech') {
				resolve(''); // On résout avec du vide pour ne pas faire planter l'app si le joueur a juste éternué
			} else {
				reject(`Erreur : ${event.error}`);
			}
		};

		recognition.start();
	});
};
