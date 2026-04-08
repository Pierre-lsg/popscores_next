<script lang="ts">
	import type { Competition } from '$lib/types/competitionType';
	import type { Regulations } from '$lib/types/regulationsType';
	import type { Championship } from '$lib/types/championshipType';

	import { getRules } from '$lib/utils/championship/competitionsFunctions.svelte';
	import { formatList } from '$lib/utils/sharedFunction';
	import { clubsStore } from '$lib/stores/championship/clubsStore.svelte';
	import { playersChampionshipStore } from '$lib/stores/championship/playersChampionshipStore.svelte';
	import { teamsCompetitionStore } from '$lib/stores/championship/teamsCompetitionStore.svelte';
	import { coursesChampionshipStore } from '$lib/stores/championship/coursesChampionshipStore.svelte';

	let { currentCompetition = $bindable(), championship = $bindable() } = $props<{
		currentCompetition: Competition | undefined;
		championship: Championship;
	}>();
	let clubsCompetition = $derived(
		clubsStore.list.filter((c) => currentCompetition.clubsId.includes(c.id))
	);
	let playersCompetition = $derived(
		playersChampionshipStore.list.filter((p) => currentCompetition.playersId.includes(p.id))
	);
	let teamsCompetition = $derived(
		teamsCompetitionStore.list.filter(
			(t) => currentCompetition.teamsId.includes(t.id) && t.sessionId === currentCompetition.id
		)
	);
	let courseCompetition = $derived(coursesChampionshipStore.find(currentCompetition.courseId));

	let rules: Regulations = $state(getRules(currentCompetition));
</script>

<div>
	{#if currentCompetition}
		<h3>Date / Lieu</h3>
		<p>{currentCompetition.startDate} / {currentCompetition.location}</p>

		{#if rules}
			<h3>Règlement</h3>
			{#if rules.regulation.teamGame}
				<p>Compétition en équipe : {rules.regulation.playersPerTeam} joueurs par équipe.</p>
				{#if rules.regulation.usePenalizingGhost}
					<p>Joueurs fantomes pénalisés si équipe incomplète</p>
				{/if}
			{:else}
				<p>Compétition individuelle</p>
				{#if rules.doubleRanking}
					<p>
						Calcul d'un classement par équipe suivant les {rules.nbPlayersForDoubleRankingTeam}
						meilleurs joueurs de chaque club
					</p>
				{/if}
			{/if}
			<p>
				Score maximum par cible : {rules.regulation.hasCrossAFixedPenalty
					? rules.regulation.malusValue + ' (la X)'
					: '+' + rules.regulation.malusOverPar + ' sur le Par'}
			</p>
			<p>
				{rules.regulation.teamGame ? 'Equipes' : 'Joueurs'} par fly : {rules.regulation.teamGame
					? rules.teamsPerFly
					: rules.playersPerFly}
			</p>
		{/if}

		<h3>Liste des clubs engagés</h3>
		{#if clubsCompetition.length > 0}
			{formatList(clubsCompetition.map((c) => c.name))}
		{:else}
			... Aucun club engagé
		{/if}

		{#if rules.regulation.teamGame}
			<h3>Liste des équipes engagées</h3>
			{#if teamsCompetition.length > 0}
				{formatList(teamsCompetition.map((t) => t.name))}
			{:else}
				<h4>Veuillez définir les équipes</h4>
			{/if}
		{:else}
			<h3>Liste des joueurs engagés</h3>
			{#if playersCompetition.length > 0}
				{formatList(playersCompetition.map((p) => p.name))}
			{:else}
				<h4>Veuillez définir les joueurs</h4>
			{/if}
		{/if}

		<h3>Liste du parcours</h3>
		{#if courseCompetition && courseCompetition.targets.length > 0}
			{formatList(courseCompetition.targets.map((t) => t.name + ' (' + t.par + '/' + t.rule + ')'))}
		{:else}
			<span role="none" onclick={() => (currentCompetition.step = 'course')}
				>Veuillez définir le parcours
			</span>
		{/if}
		<p>---</p>
		{#if currentCompetition.flysId.length > 0}
			<p>Les flys sont définis.</p>
			<h4>Démarrer la compétition ?</h4>
		{:else}
			<p>Les flys ne sont pas encore définis</p>
		{/if}
	{:else}
		<p>... erreur lors de l'accès aux informations de la compétition</p>
	{/if}
</div>
