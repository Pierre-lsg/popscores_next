<script lang="ts">
	import '$lib/styles/scoreCard.css';

	import type { Target } from '$lib/types/targetsType';
	import type { Player } from '$lib/types/playerType';
	import type { SessionSettings } from '$lib/types/gameSessionType';
	import type { Team } from '$lib/types/teamType';

	let {
		players,
		targets,
		teams,
		settings
	}: { players: Player[]; targets: Target[]; teams: Team[]; settings: SessionSettings } = $props<{
		players: Player[];
		targets: Target[];
		teams: Team[];
		settings: SessionSettings;
	}>();

	let isExpanded: boolean = $state(false);
</script>

<div class="list-card" class:expanded={isExpanded}>
	<div class="item-card">
		<strong>Date :</strong>
		{new Date(settings.sessionBeginning).toLocaleDateString()}
	</div>
	<div class="item-card">
		<strong>Lieu :</strong>
		{settings.locationName}
	</div>
	<div class="more-items">
		<div class="item-card">
			<strong>Météo :</strong>
			{settings.weatherCondition}
		</div>
		<div class="item-card">
			<strong>Jeu en équipe :</strong>
			{settings.regulation.teamGame ? 'Oui' : 'Non'}
		</div>
		{#if settings.regulation.teamGame}
			<div class="item-card">
				<strong>Nombre de joueurs par équipe :</strong>
				{settings.regulation.playersPerTeam}
			</div>
		{/if}
		<div class="item-card">
			<strong>Règles - valeur de la 'X' :</strong>
		</div>
		<div>
			{#if settings.regulation.hasCrossAFixedPenalty}
				<div class="item-card">
					<span>Fixe :</span>
					{settings.regulation.malusValue}
				</div>
			{:else}
				<div class="item-card">
					<span>Malus sur le Par :</span>
					{settings.regulation.malusOverPar}
				</div>
			{/if}
		</div>
		<div class="item-card">
			<strong>Parcours :</strong>
			{settings.locationName}
		</div>
		{#each targets as target, index}
			<ul>
				<div class="sub-item-card">
					<div>Cible #{index + 1} : {target.name}</div>
					<div>Par {target.par}, {target.rule}</div>
				</div>
			</ul>
		{/each}
		<div class="item-card">
			<strong>Joueurs :</strong>
			{#each players as p, i}
				{p.name}{i < players.length - 1 ? ', ' : ''}
			{/each}
		</div>
	</div>
	<button onclick={() => (isExpanded = !isExpanded)}>
		{isExpanded ? 'Voir moins' : 'Voir plus'}
	</button>
</div>

<style>
	.list-card {
		border: 1px solid var(--primary);
		background-color: var(--bg-card);
		border-radius: 12px;
		padding: 0.5rem;
		margin-bottom: 20px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.item-card {
		display: flex;
		justify-content: space-between;
		margin: 0.5rem 0rem;
		background-color: var(--bg-card);
	}

	.sub-item-card {
		flex-direction: column;
	}

	.more-items {
		display: none;
	}

	.expanded .more-items {
		display: block;
	}
</style>
