//
// Router général de l'application
//
export type Page =
	| 'hub'
	| 'golf-score'
	| 'golf-championship'
	| 'golf-history'
	| 'params'
	| 'other-service';

class RouterStore {
	current = $state<Page>('hub');

	goTo(newPage: Page) {
		this.current = newPage;
	}
}

export const router = new RouterStore();

//
// Router pour le championnat
//
export type ChampionshipPage = 'hub' | 'players' | 'params' | 'competition';

class ChampionshipRouterStore {
	current = $state<ChampionshipPage>('hub');

	goTo(newPage: ChampionshipPage) {
		this.current = newPage;
	}
}

export const csRouter = new ChampionshipRouterStore();
