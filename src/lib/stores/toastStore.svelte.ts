class ToastStore {
	// L'état réactif : le message actuel
	message = $state<string | null>(null);
	status = $state<string | null>(null);

	// Référence interne pour le timer afin de pouvoir l'annuler
	private timer: ReturnType<typeof setTimeout> | null = null;

	/**
	 * Affiche un toast avec un message donné et une durée.
	 * @param msg Le message à afficher dans le toast.
	 * @param status Le statut du message sucess | failure | warning
	 * @param duration La durée en millisecondes avant que le toast ne se ferme automatiquement. Par défaut, 3000 ms (3 secondes).
	 */
	show(msg: string, status = 'success', duration = 3000) {
		// 1. Si un toast est déjà en cours, on annule son compte à rebours
		if (this.timer) clearTimeout(this.timer);

		// 2. On met à jour le message
		this.message = msg;
		this.status = status;

		// 3. On lance le nouveau compte à rebours
		this.timer = setTimeout(() => {
			this.message = null;
			this.timer = null;
		}, duration);
	}
	/**
	 * Ferme manuellement le toast.
	 */
	dismiss() {
		this.message = null;
		if (this.timer) {
			clearTimeout(this.timer);
			this.timer = null;
		}
	}
}

export const toastStore = new ToastStore();
