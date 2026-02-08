<script lang="ts">
	import type { Competition } from '$lib/types/competitionType';
	import { collectiveRules, type Target } from '$lib/types/targetsType';
	import type { Course } from '$lib/types/courseType';

	import CompetitionMenu from './CompetitionMenu.svelte';
	import Param from '$lib/ui/Param.svelte';
	import Stepper from '$lib/ui/Stepper.svelte';

	import { targetsChampionshipStore } from '$lib/stores/championship/targetsChampionshipStore.svelte';
	import { coursesChampionshipStore } from '$lib/stores/championship/coursesChampionshipStore.svelte';
	import { onMount } from 'svelte';

	let { currentCompetition = $bindable() } = $props<{
		currentCompetition: Competition | undefined;
	}>();

	let ruleOptions: string[] = collectiveRules;

	let targets: Target[] = $state([]);
	let editingTarget: boolean[] = $state([]);
	let course: Course | undefined = $state();

	onMount(() => {
		if (currentCompetition) {
			let tempCourse = coursesChampionshipStore.find(currentCompetition.courseId);
			// Charger le parcours s'il existe
			if (tempCourse) course = tempCourse;
			else {
				course = coursesChampionshipStore.new();
				currentCompetition.courseId = course.id;
			}
		}
	});

	const addNewTarget = () => {
		if (course) course.targets.push(targetsChampionshipStore.new());
	};

	const editTarget = (id: number) => {
		editingTarget[id] = !editingTarget[id];
	};

	const removeTarget = (id: number) => {
		if (course) course.targets.splice(id, 1);
	};
</script>

<div>
	<CompetitionMenu bind:currentCompetition />

	<h2>Définition du parcours</h2>
	<h3>Liste des cibles</h3>
	{#if course && course?.targets.length > 0}
		<button onclick={() => addNewTarget()}>Ajouter une cible</button>

		<table>
			<tbody>
				{#each course?.targets as target, i}
					<tr>
						<td>{target.name || 'Trou #' + i}</td>
						<td>{target.par}</td>
						<td>{target.rule}</td>
						<td>
							<span role="none" onclick={() => editTarget(i)}>✏️</span>
							&nbsp;
							<span role="none" onclick={() => removeTarget(i)}>🗑️</span>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>

		{#each course?.targets as target, i}
			{#if editingTarget[i]}
				<Param
					label="⛳ Nom de la cible"
					type="text"
					bind:value={target.name}
					placeholder="Nom de la cible"
					focus={true}
				/>
				<Stepper label="Par" value={target.par} onchange={(val) => (target.par = val)} />
				<div class="select-container">
					Règle :
					<select
						id="rule{target.id}"
						bind:value={target.rule}
						onchange={() => (target.par = target.rule === 'Bonus' ? 0 : 4)}
					>
						{#each ruleOptions as option}
							<option value={option}>{option}</option>
						{/each}
					</select>
				</div>
			{/if}
		{/each}
	{:else}
		<p>Aucune cible n'a été définie</p>
	{/if}

	<ul>
		<li>Ajout une cible</li>
		<li>Autoriser la réorganisation</li>
		<li>et la suppression</li>
		<li>Ajout une cible</li>
		<li>Paramétrage détaillé</li>
		<li>sauvegarde</li>
		<li>récupération en cloud de cibles existantes</li>
		<li>créer un composant selector comme il existe un stepper</li>
	</ul>
</div>

<style>
	.select-container {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.5rem;
		background: var(--bg-card);
		border-radius: 8px;
		margin-bottom: 0.5rem;
	}
</style>
