const MOBILE_BREAKPOINT = 768;

class ViewportStore {
	// On utilise une propriété privée pour l'état interne
	// et un getter pour y accéder (lecture seule à l'extérieur)
	#isMobile = $state(true);

	constructor() {
		if (typeof window !== 'undefined') {
			// Initialisation
			this.#update();

			// Gestion de l'événement de redimensionnement
			window.addEventListener('resize', () => this.#update());
		}
	}

	// Le "getter" permet d'utiliser viewport.isMobile sans pouvoir le modifier par erreur
	get isMobile() {
		return this.#isMobile;
	}

	#update() {
		this.#isMobile = window.innerWidth < MOBILE_BREAKPOINT;
	}
}

export const viewport = new ViewportStore();
