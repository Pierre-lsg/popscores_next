export type Theme = 'classic' | 'modern' | 'high-contrast' | 'warm';

const STORAGE_KEY = 'golf-app-theme';

class ThemeStore {
	// L'état réactif
	current = $state<Theme>('classic');

	constructor() {
		if (typeof window !== 'undefined') {
			// 1. Chargement initial
			const saved = localStorage.getItem(STORAGE_KEY) as Theme;
			if (saved) this.current = saved;

			// 2. L'effet réactif : s'exécute dès que 'current' change
			$effect.root(() => {
				$effect(() => {
					// Sauvegarde
					localStorage.setItem(STORAGE_KEY, this.current);

					// Application visuelle au document
					document.documentElement.setAttribute('data-theme', this.current);
				});
			});
		}
	}

	// Méthode pour changer de thème
	set(newTheme: Theme) {
		this.current = newTheme;
	}
}

export const themeStore = new ThemeStore();
