/**
 * Enumerates the different themes available for the golf app.
 */
export type Theme = 'classic' | 'modern' | 'high-contrast' | 'warm' | 'beach';

// The key used to store and retrieve the current theme from local storage.
const STORAGE_KEY = 'golf-app-theme';

/**
 * Represents a store for managing the current theme of the golf app.
 */
class ThemeStore {
	/**
	 * Reactive state representing the current theme of the app.
	 * Defaults to 'classic'.
	 */
	current = $state<Theme>('classic');

	constructor() {
		if (typeof window !== 'undefined') {
			// Load initial state from local storage if available.
			const saved = localStorage.getItem(STORAGE_KEY) as Theme;
			if (saved) this.current = saved;

			// React to changes in the current theme.
			$effect.root(() => {
				$effect(() => {
					// Save the new theme to local storage.
					localStorage.setItem(STORAGE_KEY, this.current);

					// Apply the new theme to the document's root element.
					document.documentElement.setAttribute('data-theme', this.current);
				});
			});
		}
	}

	/**
	 * Sets the current theme to a new value.
	 * @param newTheme - The new theme to set.
	 */
	set(newTheme: Theme) {
		this.current = newTheme;
	}
}

// An instance of ThemeStore used throughout the application.
export const themeStore = new ThemeStore();
