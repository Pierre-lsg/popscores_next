// On n'a plus besoin de writable !
class NetworkStore {
	// La rune $state remplace le writable
	#online = $state(typeof navigator !== 'undefined' ? navigator.onLine : true);

	constructor() {
		if (typeof window !== 'undefined') {
			// On utilise $effect.root pour s'assurer que l'abonnement
			// reste actif tant que l'application tourne
			$effect.root(() => {
				const updateStatus = () => {
					this.#online = navigator.onLine;
				};

				window.addEventListener('online', updateStatus);
				window.addEventListener('offline', updateStatus);

				// On retourne une fonction de nettoyage (cleanup)
				return () => {
					window.removeEventListener('online', updateStatus);
					window.removeEventListener('offline', updateStatus);
				};
			});
		}
	}

	// Getter pour accéder à la valeur en lecture seule
	get isOnline() {
		return this.#online;
	}
}

export const networkStatus = new NetworkStore();
