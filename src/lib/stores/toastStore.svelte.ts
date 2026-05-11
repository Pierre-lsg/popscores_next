class ToastStore {
	// L'état réactif : le message actuel
	message = $state<string | null>(null);
	status = $state<string | null>(null);

	// Référence interne pour le timer afin de pouvoir l'annuler
	private timer: ReturnType<typeof setTimeout> | null = null;

	// Indique si le toast doit rester à l'écran jusqu'au clic
	isPersistent = $state(false);

	/**
	 * Affiche un toast avec un message donné et une durée.
	 * @param msg Le message à afficher dans le toast.
	 * @param status Le statut du message success | failure | warning
	 * @param duration La durée en millisecondes avant que le toast ne se ferme automatiquement. 0 = persistant.
	 */
	show(msg: string, status = 'success', duration = 3000) {
		if (this.timer) clearTimeout(this.timer);

		this.message = msg;
		this.status = status;
		this.isPersistent = duration === 0;

		if (duration > 0) {
			this.timer = setTimeout(() => {
				this.dismiss();
			}, duration);
		} else {
			this.timer = null;
		}
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
