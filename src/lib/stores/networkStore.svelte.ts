// NetworkStore class that manages network status
class NetworkStore {
	// A private property to store online status using $state
	#online = $state(typeof navigator !== 'undefined' ? navigator.onLine : true);

	constructor() {
		if (typeof window !== 'undefined') {
			// Using $effect.root to ensure the subscription stays active throughout app lifecycle
			$effect.root(() => {
				const updateStatus = () => {
					this.#online = navigator.onLine;
				};

				window.addEventListener('online', updateStatus);
				window.addEventListener('offline', updateStatus);

				// Returning a cleanup function to remove event listeners when component unmounts
				return () => {
					window.removeEventListener('online', updateStatus);
					window.removeEventListener('offline', updateStatus);
				};
			});
		}
	}

	// Getter method to access online status in a read-only manner
	get isOnline() {
		return this.#online;
	}
}

export const networkStatus = new NetworkStore();
