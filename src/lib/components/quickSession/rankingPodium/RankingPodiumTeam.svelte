<script lang="ts">
	import { teamsStore } from '$lib/stores/quickSession/teamsStore.svelte';
	import { targetsStore } from '$lib/stores/quickSession/targetsStore.svelte';
	import { playersStore } from '$lib/stores/quickSession/playersStore.svelte';
	import { sessionSettingsStore } from '$lib/stores/gameSessionStore.svelte';
	import TeamScoreCard from '$lib/components/core_game/TeamScoreCard.svelte';

	import { confetti } from '@neoconfetti/svelte';
	import { onDestroy } from 'svelte';
	import {
		listTeamPlayer,
		formatPlayerList,
		shareResultsTeams,
		getTeamStats,
		getRankedTeams,
		getTop3Teams,
		getOthersRankedTeams
	} from '$lib/utils/session/golfScoringFunction.svelte';
	import type { RankedTeam } from '$lib/types/teamType';

	const s = sessionSettingsStore.settings.regulation;
	const t = targetsStore.list;
	const p = playersStore.list;

	let files: any = $state();
	let previewUrl = $state('');
	let fileInput: any = $state();

	let rankedTeams = getRankedTeams(teamsStore.list, t, p, s);
	let top3Teams = getTop3Teams(rankedTeams);
	let othersRankedTeams = getOthersRankedTeams(rankedTeams);
	let viewedTeam: RankedTeam[] = $state([]);

	const viewTeamScoreCard = (team: RankedTeam) => {
		if (viewedTeam.length === 0 || viewedTeam[0].team.id !== team.team.id) {
			viewedTeam = [team];
		} else {
			viewedTeam = [];
		}
	};

	const handlePhotoTaken = (e: Event) => {
		const file = (e.target as HTMLInputElement).files?.[0];
		if (file) {
			if (previewUrl) URL.revokeObjectURL(previewUrl);
			previewUrl = URL.createObjectURL(file);
		}
	};

	const catchNewPhoto = () => {
		if (previewUrl) URL.revokeObjectURL(previewUrl);
		previewUrl = '';
		if (fileInput) {
			fileInput.value = '';
		}
	};

	onDestroy(() => {
		if (previewUrl) URL.revokeObjectURL(previewUrl);
	});
</script>

<div use:confetti={{ particleCount: 200 }}></div>

<div class="podium-container">
	<div class="podium-visual">
		{#if top3Teams[1]}
			{@const stats = getTeamStats(top3Teams[1].team, t, p, s)}
			<div class="place silver" role="none" onclick={() => viewTeamScoreCard(top3Teams[1])}>
				<span class="podium-score">{stats.gross} ({stats.diff})</span>
				<div class="bar"></div>
				<span class="podium-name">{top3Teams[1].team.name}</span>
				<span class="podium-name"
					>({formatPlayerList(listTeamPlayer(top3Teams[1].team, p), s)})</span
				>
			</div>
		{/if}

		{#if top3Teams[0]}
			{@const stats = getTeamStats(top3Teams[0].team, t, p, s)}
			<div class="place gold" role="none" onclick={() => viewTeamScoreCard(top3Teams[0])}>
				<span class="medal">👑</span>
				<span class="podium-score">{stats.gross} ({stats.diff})</span>
				<div class="bar"></div>
				<span class="podium-name">{top3Teams[0].team.name} </span>
				<span class="podium-name"
					>({formatPlayerList(listTeamPlayer(top3Teams[0].team, p), s)})</span
				>
			</div>
		{/if}

		{#if top3Teams[2]}
			{@const stats = getTeamStats(top3Teams[2].team, t, p, s)}
			<div class="place bronze" role="none" onclick={() => viewTeamScoreCard(top3Teams[2])}>
				<span class="podium-score">{stats.gross} ({stats.diff})</span>
				<div class="bar"></div>
				<span class="podium-name">{top3Teams[2].team.name}</span>
				<span class="podium-name"
					>({formatPlayerList(listTeamPlayer(top3Teams[2].team, p), s)})</span
				>
			</div>
		{/if}
	</div>

	{#if othersRankedTeams.length > 0}
		<div class="others-list">
			{#each othersRankedTeams as team, i}
				{@const stats = getTeamStats(team.team, t, p, s)}
				<div class="other-item" role="none" onclick={() => viewTeamScoreCard(team)}>
					<span class="rank">{i + 4}</span>
					<span class="podium-name">{team.team.name}</span>
					<span class="podium-score">{stats.gross} ({stats.diff})</span>
				</div>
			{/each}
		</div>
	{/if}

	{#if viewedTeam.length > 0}
		<TeamScoreCard
			rankedTeams={viewedTeam}
			targets={targetsStore.list}
			players={playersStore.list}
			settings={s}
		/>
	{/if}

	<div>
		<input
			type="file"
			accept="image/*"
			capture="environment"
			bind:this={fileInput}
			bind:files
			onchange={handlePhotoTaken}
			id="camera-input"
			hidden
		/>

		<div class="btn-action">
			{#if !previewUrl}
				<button class="share-button" onclick={shareResultsTeams(rankedTeams, t, p, s)}>
					<span class="icon">📤</span>
					Partager les résultats
				</button>
				<span>
					<label for="camera-input" class="btn-photo"> 📷 Avec photo </label>
				</span>
			{/if}
		</div>

		{#if previewUrl}
			<img src={previewUrl} alt="Preview" class="preview-img" />
			<div class="btn-action">
				<button class="share-button" onclick={shareResultsTeams(rankedTeams, t, p, s, files[0])}>
					📤 Partager maintenant
				</button>
				<button class="btn-photo" onclick={catchNewPhoto}> Refaire la photo </button>
			</div>
		{/if}
	</div>
</div>

<style>
	.btn-photo {
		display: flex;
		align-items: center; /* Center text vertically */
		padding: 6px 0px;
		background-color: #4338ca;
		color: white;
		border-radius: 8px;
		cursor: pointer;
		font-weight: bold;
		text-align: center;
		height: 80%;
	}

	.btn-action {
		display: flex;
		flex-direction: row;
	}

	.preview-img {
		width: 100%;
		border-radius: 8px;
		margin: 10 px;
	}
</style>
