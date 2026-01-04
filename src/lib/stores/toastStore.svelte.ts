class ToastStore {
	// L'état réactif : le message actuel
	message = $state<string | null>(null);

	// Référence interne pour le timer afin de pouvoir l'annuler
	private timer: ReturnType<typeof setTimeout> | null = null;

	show(msg: string, duration = 3000) {
		// 1. Si un toast est déjà en cours, on annule son compte à rebours
		if (this.timer) clearTimeout(this.timer);

		// 2. On met à jour le message
		this.message = msg;

		// 3. On lance le nouveau compte à rebours
		this.timer = setTimeout(() => {
			this.message = null;
			this.timer = null;
		}, duration);
	}

	// Permet de fermer manuellement le toast (ex: clic sur une croix)
	dismiss() {
		this.message = null;
		if (this.timer) {
			clearTimeout(this.timer);
			this.timer = null;
		}
	}
}

export const toastStore = new ToastStore();
