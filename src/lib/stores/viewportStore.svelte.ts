// Breakpoint for mobile devices width screen
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

	/**
	 * Getter for the isMobile property.
	 * @returns {boolean} True if the viewport width is less than the mobile breakpoint, false otherwise.
	 */
	get isMobile() {
		return this.#isMobile;
	}

	/**
	 * Private method to update the isMobile property based on the current window width.
	 */
	#update() {
		this.#isMobile = window.innerWidth < MOBILE_BREAKPOINT;
	}
}

export const viewport = new ViewportStore();
