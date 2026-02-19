<script lang="ts">
	import GolfChampionship from '$lib/views/GolfChampionship.svelte';
	import type { Championship } from '$lib/types/championshipType';
	import { championshipStore } from '$lib/stores/championship/championshipsStore.svelte';
	import { user } from '$lib/utils/pocketbase/pocketBase';

	import { securityCheck } from '$lib/utils/security';
	import { onMount } from 'svelte';
	import { championshipService } from '$lib/utils/pocketbase/championships2Cloud';

	let currentChampionship: Championship | undefined = $state(championshipStore.list[0]);
	let cloudChampionships: any = $state();
	let loading: boolean = $state(true);

	onMount(() => {
		securityCheck();

		listCloudChampionship();
		loading = false;
	});

	const listCloudChampionship = async () => {
		cloudChampionships = await championshipService.getAll();
	};

	const addNewChampionship = () => {
		currentChampionship = championshipStore.new();
	};
</script>

<!-- Existe un championnat -->
{#if currentChampionship}
	<GolfChampionship bind:currentChampionship />
{:else}
	<!-- Sinon, lister les championnats disponibles en ligne -->
	{#if !loading}
		<p>Sélectionner un championnat</p>
		{#each cloudChampionships as champs}
			<div>
				{champs.data.name} - {champs.data.id}
			</div>
		{/each}
	{:else}
		<p>Récupération des championnats connus ...</p>
	{/if}

	{#if $user && $user?.role.includes('admin')}
		<p>Créer un nouveau championnat</p>
		<button onclick={() => addNewChampionship()}>Créer nouveau championnat</button>
	{/if}
{/if}
