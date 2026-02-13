<script lang="ts">
	import { slide } from 'svelte/transition';
	import { playersStore } from '$lib/stores/quickSession/playersStore.svelte';
	import { teamsStore } from '$lib/stores/quickSession/teamsStore.svelte';
	import { sessionSettingsStore } from '$lib/stores/gameSessionStore.svelte';
	import { shuffle } from '$lib/utils/sharedFunction';
	import Selector from '$lib/ui/Selector.svelte';
	import type { Team } from '$lib/types/teamType';

	const s = sessionSettingsStore.settings;

	let isSettingTeams: boolean = $state(false);
	let isEditingTeams: boolean = $state(false);

	let editingId = $state<string | null>(null);
	let editingTeamId = $state<string | null>(null);

	let selectedTeamId: string = $state('');

	const addPlayer = () => {
		playersStore.add('Joueur #' + (playersStore.list.length + 1));
	};

	const addTeam = () => {
		teamsStore.add(crypto.randomUUID(), 'Team #' + (teamsStore.list.length + 1), []);
	};

	const createTeams = () => {
		const nbPlayerPerTeam = s.playersPerTeam;
		const nbTeams = Math.floor(playersStore.list.length / nbPlayerPerTeam) + 1;
		const playersSorted = shuffle(playersStore.list);

		let playersId: string[] = [];

		teamsStore.reset();

		// Répartition des joueurs dans les équipes
		for (let i = 0; i < nbTeams; i++) {
			const teamName = 'Team #' + (i + 1);
			const teamId = crypto.randomUUID();
			playersId = [];

			for (let j = 0; j < nbPlayerPerTeam; j++) {
				if (playersSorted.length != 0) {
					playersId.push(playersSorted[0].id);
					playersSorted.shift();
				}
			}
			teamsStore.add(teamId, teamName, playersId);

			// Mise à jour des joueurs
			playersId.forEach((playerId) => {
				playersStore.list.find((p) => p.id === playerId)!.teamId = teamId;
			});
		}
	};

	const settingTeams = () => {
		isSettingTeams = !isSettingTeams;
		isEditingTeams = false;
	};

	const editPlayerName = (id: string) => {
		editingId = id;
	};

	const saveName = (e: Event) => {
		editingId = null;
	};

	const editTeamName = (id: string) => {
		editingTeamId = id;
	};

	const saveTeamName = () => {
		editingTeamId = null;
	};

	const focus = (node: HTMLInputElement) => {
		node.focus();
		node.select();
	};

	// playersStore.svelte.ts (ou teamsStore selon ta préférence)

	const movePlayerToTeam = (playerId: string, targetTeamId: string) => {
		const player = playersStore.list.find((p) => p.id === playerId);
		if (!player) return;

		// 1. Gérer l'ancienne équipe (s'il en avait une)
		if (player.teamId !== '') {
			const oldTeam = teamsStore.list.find((t) => t.id === player.teamId);
			if (oldTeam) {
				oldTeam.playersId = oldTeam.playersId.filter((id) => id !== playerId);
			}
		}

		// 2. Mettre à jour le joueur
		player.teamId = targetTeamId;

		// 3. Gérer la nouvelle équipe
		if (targetTeamId !== '') {
			const newTeam = teamsStore.list.find((t) => t.id === targetTeamId);
			if (newTeam && !newTeam.playersId.includes(playerId)) {
				newTeam.playersId.push(playerId);
			}
		}
	};
</script>

<div class="step-content" in:slide>
	<button onclick={addPlayer} class="btn btn-primary">Ajouter un Joueur</button>
	<button onclick={settingTeams} class="btn btn-primary">☰ Param équipes</button>
	{#if isSettingTeams}
		<button onclick={createTeams} class="btn btn-secondary">Définir les équipes</button>
		<button onclick={addTeam} class="btn btn-secondary">Ajouter une équipe</button>
	{/if}

	<!-- Liste des équipes -->
	<div class="card-list">
		<div>
			{#each teamsStore.list as team (team.id)}
				<div class="team-items">
					<div class="team-item">
						{#if editingTeamId === team.id}
							<input
								class="name-input"
								bind:value={team.name}
								onblur={() => saveTeamName()}
								onkeydown={(e) => e.key === 'Enter' && saveTeamName()}
								use:focus
							/>
						{:else}
							<button class="invisible-button" onclick={() => editTeamName(team.id)}>
								{team.name}
							</button>
						{/if}
					</div>
					<div class="team-item">
						{#each team.playersId as playerId}
							{@const player = playersStore.list.find((p) => p.id === playerId) || {
								id: '',
								name: '',
								teamId: '',
								scores: {}
							}}
							<div class="player-item">
								{#if editingId === player.id}
									<input
										class="name-input"
										bind:value={player.name}
										onblur={saveName}
										onkeydown={(e) => e.key === 'Enter' && saveName(e)}
										use:focus
									/>
								{:else}
									<button class="invisible-button" onclick={() => editPlayerName(player.id)}>
										{player.name}
									</button>
									<div class="handle">
										<button
											class="invisible-button"
											onclick={() => movePlayerToTeam(player.id, '')}
											title="Retirer de l'équipe"
										>
											✕
										</button>
									</div>
								{/if}
							</div>
						{/each}
					</div>
					{#if team.playersId.length == 0}
						<div class="handle">
							<button
								class="invisible-button"
								onclick={() => teamsStore.remove(team.id)}
								title="Supprimer l'équipe"
							>
								✕
							</button>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</div>

	<div>
		{#if playersStore.unassignedPlayers.length > 0}
			<div>
				<h4>Joueurs à placer :</h4>
				<div class="players-list">
					{#each playersStore.unassignedPlayers as player}
						<div class="player-items">
							<span>{player.name}</span>

							<Selector
								bind:value={selectedTeamId}
								unselectedOption="Choisir une équipe..."
								options={teamsStore.list.map((t: Team) => t.id)}
								optionsLabel={teamsStore.list.map((t: Team) => t.name)}
								onchange={() => movePlayerToTeam(player.id, selectedTeamId)}
							/>

							<div class="handle">
								<button
									class="invisible-button"
									onclick={() => playersStore.remove(player.id)}
									title="Supprimer le joueur"
								>
									✕
								</button>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.player-items {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: var(--bg-card);
		border-radius: 8px;
		padding: 0.5rem 1rem;
		touch-action: shadow;
	}

	.player-item {
		display: flex;
		background: var(--bg-card);
		border: 1px solid var(--border-color);
		border-radius: 8px;
		padding: 0.5rem 0.5rem;
		margin: 0.1rem;
		touch-action: shadow;
	}

	.team-items {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: var(--bg-card);
		border: 1px solid var(--border-color);
		border-radius: 8px;
		padding: 0.2rem 0.2rem;
		margin: 0 0 0.5rem 0;
		touch-action: shadow;
	}

	.team-item {
		display: flex;
		flex-direction: column;
		background: var(--bg-card);
		padding: 0.5rem 0.1rem;
		touch-action: shadow;
		width: 100%;
	}
</style>
