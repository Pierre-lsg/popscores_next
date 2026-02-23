<script lang="ts">
	import type { SessionArchive } from '$lib/types/sessionType';
	import { getRankedPlayers, getRankedTeams } from '$lib/utils/session/golfScoringFunction.svelte';
	import { historyService } from '$lib/utils/pocketbase/history2Cloud';
	import { historyStore } from '$lib/stores/quickSession/historyStore.svelte';
	import { toastStore } from '$lib/stores/toastStore.svelte';

	import type { Player } from '$lib/types/playerType';
	import type { SessionSettings } from '$lib/types/gameSessionType';
	import type { Team } from '$lib/types/teamType';
	import type { Target } from '$lib/types/targetType';

	import { user } from '$lib/utils/pocketbase/pocketBase';
	import SessionDetails from '$lib/components/quickSession/SessionDetails.svelte';
	import PlayerScoreCard from '$lib/ui/PlayerScoreCard.svelte';
	import PlayerScoreOrder from '$lib/ui/PlayerScoreOrder.svelte';
	import TeamScoreCard from '$lib/ui/TeamScoreCard.svelte';
	import TeamScoreOrder from '$lib/ui/TeamScoreOrder.svelte';

	const data = localStorage.getItem('golf-history');

	let { title = '', currentSession = $bindable('') } = $props<{
		title?: string;
		currentSession: string;
	}>();

	let session: SessionArchive | undefined = $derived(
		historyStore.list.find((s) => s.id === currentSession)
	);

	let settings: SessionSettings = $derived(session?.settings ?? ({} as SessionSettings));
	let players: Player[] = $derived(session?.players || []);
	let targets: Target[] = $derived(session?.targets || []);
	let teams: Team[] = $derived(session?.teams || []);

	let rankedPlayers = $derived(getRankedPlayers(players || [], targets || []));
	let rankedTeams = $derived(
		getRankedTeams(teams || [], targets || [], players || [], settings.regulation)
	);

	const retourHistorique = () => {
		currentSession = '';
	};

	const saveSessionToCloud = async () => {
		try {
			const record = historyService.saveSession(session);
			console.log(record);
			toastStore.show('💾 Sauvegarde effectuée ...', 'success');
		} catch (err) {
			toastStore.show("💾 Echec à l'enregistrement ...", 'failure');
		}
	};
</script>

<div>
	<div class="action">
		<button onclick={() => retourHistorique()}>Back</button>
		{#if $user}
			<button onclick={() => saveSessionToCloud()}>Enregistrer dans le Cloud</button>
		{/if}
	</div>
	<h2>{title}</h2>
	{#if session}
		<div>
			<!-- Détails de la session -->
			<SessionDetails {players} {targets} {teams} {settings} />

			{#if settings.regulation.teamGame}
				<!-- Affichage du résultat par équipe -->
				<h3>Carte de score par équipe</h3>
				<TeamScoreOrder {rankedTeams} {targets} {players} settings={settings.regulation} />
			{/if}

			<!-- Affichage du résultat par joueur-->
			<h3>Résultat individuels</h3>
			<PlayerScoreOrder {rankedPlayers} {targets} />

			{#if settings.regulation.teamGame}
				<!-- Carte des scores par équipe -->
				<h3>Carte de score par équipe</h3>
				<TeamScoreCard {rankedTeams} {targets} {players} settings={settings.regulation} />
			{/if}

			<!-- Carte des scores par joueur -->
			<h3>Carte de score par joueur</h3>
			<PlayerScoreCard {rankedPlayers} {targets} />
		</div>
	{:else}
		<p>Aucune donnée de session trouvée.</p>
	{/if}
</div>
