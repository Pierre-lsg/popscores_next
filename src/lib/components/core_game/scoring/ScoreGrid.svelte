<script lang="ts">
	import type { Target } from '$lib/types/targetType';
	import type { Player } from '$lib/types/playerType';
	import type { Team } from '$lib/types/teamType';
	import { individualRules } from '$lib/types/targetType';
	import Stepper from '$lib/ui/Stepper.svelte';

	let {
		target,
		players,
		teams = [],
		minTrys,
		maxTrys,
		onScoreChange // (playerId: string, targetId: string, score: number) => void
	} = $props<{
		target: Target;
		players: Player[];
		teams?: Team[];
		minTrys: number;
		maxTrys: number;
		onScoreChange: (playerId: string, targetId: string, score: number) => void;
	}>();

	// Vérifie si la règle cible tout le monde individuellement (même en mode équipe)
	let isIndividualRule = $derived(
		teams.length === 0 || individualRules.includes(target.rule || '') || target.rule === 'Bonus' || target.rule === 'Individuel'
	);

	const updateScoreTeam = (team: Team, targetId: string, score: number) => {
		team.playersId.forEach((playerId) => {
			onScoreChange(playerId, targetId, score);
		});
	};
</script>

<div class="scores-grid">
	<table>
		<tbody>
			{#if isIndividualRule}
				<!-- AFFICHAGE INDIVIDUEL -->
				{#each players as player}
					<tr class="score">
						<td class="player-name">{player.name}</td>
						<td>
							<Stepper
								value={player.scores[target.id] ?? 0}
								min={minTrys}
								max={maxTrys}
								onchange={(val) => onScoreChange(player.id, target.id, val)}
							/>
						</td>
						<td class="btn-actions">
							<button
								class="btn-par"
								onclick={() => onScoreChange(player.id, target.id, target.par)}
								title="Par"
							>
								=
							</button>
							&nbsp;&nbsp;
							<button
								class="btn-delete"
								onclick={() => onScoreChange(player.id, target.id, maxTrys)}
								title="Echec"
							>
								x
							</button>
						</td>
					</tr>
				{/each}
			{:else}
				<!-- AFFICHAGE PAR EQUIPE -->
				{#each teams as team}
					{@const player = players.find((p) => p.id === team.playersId[0])}
					{#if player}
						<tr class="score">
							<td class="player-name">{team.name}</td>
							<td>
								<Stepper
									value={player.scores[target.id] ?? 0}
									min={minTrys}
									max={maxTrys}
									onchange={(val) => updateScoreTeam(team, target.id, val)}
								/>
							</td>
							<td class="btn-actions">
								<button
									class="btn-par"
									onclick={() => updateScoreTeam(team, target.id, target.par)}
									title="Par"
								>
									=
								</button>
								&nbsp;&nbsp;
								<button
									class="btn-delete"
									onclick={() => updateScoreTeam(team, target.id, maxTrys)}
									title="Echec"
								>
									x
								</button>
							</td>
						</tr>
					{/if}
				{/each}
			{/if}
		</tbody>
	</table>
</div>
