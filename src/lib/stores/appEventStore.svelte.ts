import type { AppEvents, AppStatus } from '$lib/types/appEvent';

const STORAGE_KEY = 'app-status';

/**
 * Represents a store for managing the current theme of the golf app.
 */
class AppStatusStore {
	/**
	 * Reactive state representing the current theme of the app.
	 * Defaults to 'classic'.
	 */
	list = $state<AppEvents[]>([]);

	constructor() {
		if (typeof window !== 'undefined') {
			const saved = localStorage.getItem(STORAGE_KEY);
			this.list = saved ? JSON.parse(saved) : [];

			$effect.root(() => {
				$effect(() => {
					localStorage.setItem(STORAGE_KEY, JSON.stringify(this.list));
				});
			});
		}
	}
	/**
	 * Adds a new event to the list.
	 *
	 * @param keyEvent - The key of the event.
	 * @param status - The level of action the event
	 * @param details - A description for the user
	 */
	add(keyEvent: string, status: AppStatus, details: string) {
		this.list.push({
			keyEvent,
			status,
			details
		});
	}

	/**
	 * Loads an external event to the list.
	 *
	 * @param aevent - event
	 */
	load(aEvent: AppEvents) {
		this.list.push(aEvent);
	}

	/**
	 * Find a event from the list.
	 *
	 * @param id - ID of the event to remove
	 */
	find(keyEvent: string): AppEvents | undefined {
		return this.list.find((e) => e.keyEvent === keyEvent);
	}

	/**
	 * Removes a event from the list.
	 *
	 * @param id - The ID of the event to remove.
	 */
	remove(keyEvent: string) {
		this.list = this.list.filter((e) => e.keyEvent !== keyEvent);
	}

	/**
	 * Resets the event list to an empty array.
	 */
	reset() {
		this.list = [];
	}

	/**
	 * Compute the status depending on the registered events
	 */
	computeStatus() {
		const currentStatus = this.list.map((s) => s.status);
		if (currentStatus.includes('alert')) return 'alert';
		if (currentStatus.includes('warning')) return 'warning';
		if (currentStatus.includes('info')) return 'info';
		return 'nothing';
	}
}

// An instance of AppStatusStore used throughout the application.
export const messageStore = new AppStatusStore();
