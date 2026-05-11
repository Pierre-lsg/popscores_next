<script lang="ts">
	import {
		getRankedPlayers,
		getPlayerStats,
		getTop3Players,
		getOthersRankedPlayers,
		shareResultsPlayers
	} from '$lib/utils/session/golfScoringFunction.svelte';

	import { targetsStore } from '$lib/stores/quickSession/targetsStore.svelte';
	import PlayerScoreCard from '$lib/components/core_game/PlayerScoreCard.svelte';
	import type { RankedPlayer } from '$lib/types/playerType';

	import { playersStore } from '$lib/stores/quickSession/playersStore.svelte';
	import { confetti } from '@neoconfetti/svelte';
	import { onDestroy } from 'svelte';

	let t = targetsStore.list;
	let files: any = $state();
	let previewUrl = $state('');
	let fileInput: any = $state();

	let rankedPlayers = getRankedPlayers(playersStore.list, targetsStore.list);
	let top3Players = getTop3Players(rankedPlayers);
	let othersRankedPlayers = getOthersRankedPlayers(rankedPlayers);
	let viewedPlayer: RankedPlayer[] = $state([]);

	const viewPlayerScoreCard = (player: RankedPlayer) => {
		if (viewedPlayer.length === 0 || viewedPlayer[0].player.id !== player.player.id) {
			viewedPlayer = [player];
		} else {
			viewedPlayer = [];
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
		{#if top3Players[1]}
			{@const stats = getPlayerStats(top3Players[1].player, t)}
			<div class="place silver" role="none" onclick={() => viewPlayerScoreCard(top3Players[1])}>
				<span class="podium-score">{stats.gross} ({stats.diff})</span>
				<div class="bar"></div>
				<span class="podium-name">{top3Players[1].player.name}</span>
			</div>
		{/if}

		{#if top3Players[0]}
			{@const stats = getPlayerStats(top3Players[0].player, t)}
			<div class="place gold" role="none" onclick={() => viewPlayerScoreCard(top3Players[0])}>
				<span class="medal">👑</span>
				<span class="podium-score">{stats.gross} ({stats.diff})</span>
				<div class="bar"></div>
				<span class="podium-name">{top3Players[0].player.name}</span>
			</div>
		{/if}

		{#if top3Players[2]}
			{@const stats = getPlayerStats(top3Players[2].player, t)}
			<div class="place bronze" role="none" onclick={() => viewPlayerScoreCard(top3Players[2])}>
				<span class="podium-score">{stats.gross} ({stats.diff})</span>
				<div class="bar"></div>
				<span class="podium-name">{top3Players[2].player.name}</span>
			</div>
		{/if}
	</div>

	{#if othersRankedPlayers.length > 0}
		<div class="others-list">
			{#each othersRankedPlayers as player, i}
				{@const stats = getPlayerStats(player.player, t)}
				<div class="other-item" role="none" onclick={() => viewPlayerScoreCard(player)}>
					<span class="rank">{i + 4}</span>
					<span class="podium-name">{player.player.name}</span>
					<span class="podium-score">{stats.gross} ({stats.diff})</span>
				</div>
			{/each}
		</div>
	{/if}

	{#if viewedPlayer.length > 0}
		<PlayerScoreCard rankedPlayers={viewedPlayer} targets={targetsStore.list} />
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
				<button class="share-button" onclick={shareResultsPlayers(rankedPlayers, t)}>
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
				<button class="share-button" onclick={shareResultsPlayers(rankedPlayers, t, files[0])}>
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
