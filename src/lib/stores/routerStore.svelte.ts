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
