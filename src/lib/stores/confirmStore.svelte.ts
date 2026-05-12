class ConfirmStore {
	message = $state<string | null>(null);
	isOpen = $state(false);
	private resolveFn: ((value: boolean) => void) | null = null;

	prompt(msg: string): Promise<boolean> {
		this.message = msg;
		this.isOpen = true;
		return new Promise((resolve) => {
			this.resolveFn = resolve;
		});
	}

	respond(result: boolean) {
		this.isOpen = false;
		if (this.resolveFn) {
			this.resolveFn(result);
			this.resolveFn = null;
		}
	}
}

export const confirmStore = new ConfirmStore();
