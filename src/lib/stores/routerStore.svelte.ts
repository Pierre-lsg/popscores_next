export type Page = 'hub' | 'golf-score' | 'golf-history' | 'params' | 'other-service';

class RouterStore {
	// La rune $state remplace le writable
	current = $state<Page>('hub');

	// Une méthode simple pour changer de page
	goTo(newPage: Page) {
		this.current = newPage;
	}
}

export const router = new RouterStore();
