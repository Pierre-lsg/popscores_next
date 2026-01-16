<script lang="ts">
	import type { SessionArchive } from '$lib/types/sessionInterface';
	import {
		getRankedPlayers,
		getPlayerStats,
		calculatePlayerScore,
		totalPar,
		getScoreClass
	} from '$lib/utils/streetGolfSession/golfScoringFunction.svelte';
	import { slide, fade } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	import type { Player } from '$lib/types/playerInterface';
	import type { SessionSettings } from '$lib/types/gameSessionInterface';
	import type { Team } from '$lib/types/teamInterface';
	import type { Target } from '$lib/types/targetsInterface';

	const data = localStorage.getItem('golf-history');

	let {
		title = '',
		session = null,
		currentSession = $bindable('')
	} = $props<{
		title?: string;
		session?: SessionArchive | null;
		currentSession: string;
	}>();

	let settings: SessionSettings = $derived(session?.settings);
	let players: Player[] = $derived(session?.players || []);
	let targets: Target[] = $derived(session?.targets || []);
	let teams: Team[] = $derived(session?.teams || []);

	let rankedPlayerList = $derived(getRankedPlayers(players || []));
	let isExpanded = $state(false);

	function retourHistorique() {
		currentSession = '';
	}
</script>

<div>
	<button onclick={() => retourHistorique()}>Back</button>
	<h2>{title}</h2>
	{#if session}
		<div>
			<!-- Détails de la session -->
			<div class="list-card">
				<div class="item-card">
					<strong>Date :</strong>
					{new Date(settings.sessionBeginning).toLocaleDateString()}
				</div>
				<div class="item-card">
					<strong>Lieu :</strong>
					{settings.locationName}
				</div>
				{#if isExpanded}
					<div transition:slide={{ duration: 600, easing: quintOut }} class="parchment-content">
						<div in:fade={{ duration: 400 }}>
							<div class="item-card">
								<strong>Météo :</strong>
								{settings.weatherCondition}
							</div>
							<div class="item-card">
								<strong>Jeu en équipe :</strong>
								{settings.teamGame ? 'Oui' : 'Non'}
							</div>
							{#if settings.teamGame}
								<div class="item-card">
									<strong>Nombre de joueurs par équipe :</strong>
									{settings.playersPerTeam}
								</div>
							{/if}
							<div class="list-item-card">
								<strong>Règles - valeur de la 'X' :</strong>
								<div>
									{#if settings.hasCrossAFixedPenalty}
										Fixe : {settings.malusValue}
									{:else}
										Malus sur le Par : {settings.malusOverPar}
									{/if}
								</div>
							</div>
							<div class="item-card">
								<strong>Parcours :</strong>
								{settings.locationName}
							</div>
							<div class="item-card">
								<strong>Joueurs :</strong>
								{#each players as p, i}
									{p.name}{i < players.length - 1 ? ', ' : ''}
								{/each}
							</div>
						</div>
					</div>
				{/if}
				<button onclick={() => (isExpanded = !isExpanded)} class="toggle-btn">
					<span class="icon" class:rotated={isExpanded}>▲</span>
					{isExpanded ? 'Refermer' : 'Lire la suite'}
				</button>
			</div>
			<!-- Affichage du podium -->
			<div class="list-card">
				{#each rankedPlayerList as player, i}
					{@const p = player.player}
					{@const stats = getPlayerStats(p)}
					<div class="item-card">
						<span class="rank"
							>{player.rank}
							{#if player.isTie}
								*
							{/if}
						</span>
						<span class="podium-name">{p.name}</span>
						<span class="podium-score">{stats.gross} ({stats.diff})</span>
					</div>
				{/each}
			</div>
			<!-- Carte des scores -->
			<table class="table-container">
				<thead>
					<tr class="header">
						<th class="fixed-column">Cibles</th>
						<th class="vertical-header par-row"><span>Par</span></th>
						{#each rankedPlayerList as player}
							<th class="vertical-header"><span>{player.player.name}</span></th>
						{/each}
					</tr>
				</thead>
				<tbody>
					{#each targets as target, i}
						<tr>
							<td class="fixed-column">{target.name || 'Trou ' + (i + 1)}</td>
							<td class="par-row">{target.par}</td>
							{#each rankedPlayerList as player}
								{@const score = player.player.scores[target.id]}
								<td class={getScoreClass(score, target)}>
									<div class="shape">
										{score}
									</div>
								</td>
							{/each}
						</tr>
					{/each}
				</tbody>
				<tfoot>
					<tr class="footer">
						<td class="fixed-column">Total</td>
						<td class="par-row">{totalPar}</td>
						{#each rankedPlayerList as player}
							<td>{calculatePlayerScore(player.player)}</td>
						{/each}
					</tr>
				</tfoot>
			</table>
		</div>
	{:else}
		<p>Aucune donnée de session trouvée.</p>
	{/if}
</div>

<style>
	.podium-name {
		font-size: 1rem;
	}

	.item-card {
		display: flex;
		justify-content: space-between;
		margin: 0.5rem 0rem;
		background-color: var(--bg-card);
	}

	.list-card {
		border: 1px solid var(--primary);
		background-color: var(--bg-card);
		border-radius: 12px;
		padding: 1rem;
		margin-bottom: 20px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.parchment-content {
		overflow: hidden;
		margin-top: 0.5rem;
	}

	.toggle-btn {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-top: 10px;
		background: none;
		border: none;
		color: var(--primary);
		cursor: pointer;
		font-variant: small-caps;
		font-weight: bold;
	}

	.icon {
		display: inline-block;
		transition: transform 0.4s ease;
		transform: rotate(180deg);
	}

	.icon.rotated {
		transform: rotate(0deg);
	}
</style>
