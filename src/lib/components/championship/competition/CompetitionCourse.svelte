<script lang="ts">
	import { confirmStore } from '$lib/stores/confirmStore.svelte';
	import type { Competition } from '$lib/types/competitionType';
	import { collectiveRules, individualRules, type Target } from '$lib/types/targetType';
	import type { Course } from '$lib/types/courseType';

	import { dndzone } from 'svelte-dnd-action';
	import { slide, fly } from 'svelte/transition';
	import { flip } from 'svelte/animate';

	import CompetitionMenu from './CompetitionMenu.svelte';
	import Param from '$lib/ui/Param.svelte';
	import Stepper from '$lib/ui/Stepper.svelte';
	import Selector from '$lib/ui/Selector.svelte';
	import TextField from '$lib/ui/TextField.svelte';
	import TargetProps from '$lib/components/core_game/TargetProps.svelte';

	import { isCompetitionTeam } from '$lib/utils/championship/competitionsFunctions.svelte';
	import { targetsChampionshipStore } from '$lib/stores/championship/targetsChampionshipStore.svelte';
	import { coursesChampionshipStore } from '$lib/stores/championship/coursesChampionshipStore.svelte';
	import { onMount } from 'svelte';

	let { currentCompetition = $bindable() } = $props<{
		currentCompetition: Competition | undefined;
	}>();

	const isTeamGame = isCompetitionTeam(currentCompetition);
	const ruleOptions = isTeamGame ? collectiveRules : individualRules;

	let targets: Target[] = $state([]);
	let isEditingTarget: boolean[] = $state([]);
	let isEditing: boolean = $state(false);

	let course: Course | undefined = $derived(
		coursesChampionshipStore.find(currentCompetition.courseId)
	);

	const flipDurationMs = 200;
	let isDragging = $state(false);

	// Chargement du parcours de la compétition
	onMount(() => {
		if (currentCompetition) {
			let tempCourse = coursesChampionshipStore.find(currentCompetition.courseId);
			// Charger le parcours s'il existe
			if (tempCourse) course = tempCourse;
			else {
				course = coursesChampionshipStore.new();
				course.name = currentCompetition.name;
				currentCompetition.courseId = course.id;
			}
			targets = course.targets;
		}
	});

	const removeTarget = async (id: string) => {
		if (await confirmStore.prompt('Voulez-vous vraiment supprimer cette cible ?')) {
			course?.targets.splice(
				course.targets.findIndex((target) => target.id === id),
				1
			);
		}
		isEditingTarget.fill(false);
		isEditing = false;
	};

	const addNewTarget = async () => {
		if (course) {
			course.targets.push(targetsChampionshipStore.new());
			targets = course.targets;
		}
	};

	const editTarget = async (id: number) => {
		isEditingTarget[id] = !isEditingTarget[id];
		for (let i = 0; i < isEditingTarget.length; i++) {
			if (i !== id) isEditingTarget[i] = false;
		}
		isEditing = isEditingTarget[id];
	};

	// Drag & drop functions
	const handleConsider = async () => {
		isDragging = true;
		isEditingTarget = isEditingTarget.map(() => false);
	};

	const handleFinalize = async (e: CustomEvent<{ items: any[] }>) => {
		targets = e.detail.items;
		if (course) course.targets = targets;
		isDragging = false;
	};

	const handleRemoveDrop = async (e: CustomEvent<{ items: any[] }>) => {
		const removedItem = e.detail.items[0];
		if (removedItem) {
			targets = targets.filter((t) => t.id !== removedItem.id);
			if (course) course.targets = targets;
		}
		isDragging = false;
	};
</script>

<div>
	<CompetitionMenu bind:currentCompetition />

	<h2>Définition du parcours</h2>
	{#if !isEditing}
		<h3>Liste des cibles</h3>
		<button onclick={async () => addNewTarget()} class="btn btn-primary">Ajouter une cible</button>
		{#if course && targets.length > 0}
			<div class="step-content" in:slide>
				<div
					class="targets-list"
					use:dndzone={{
						items: targets,
						flipDurationMs,
						dropTargetStyle: { outline: '2px dashed var(--primary)', borderRadius: '8px' }
					}}
					onconsider={(e) => {
						handleConsider();
						targets = e.detail.items;
					}}
					onfinalize={handleFinalize}
				>
					{#each targets as target (target.id)}
						<div class="target-item" animate:flip={{ duration: flipDurationMs }}>
							<div class="content">
								<span class="target-name">
									<TextField bind:value={target.name} />
								</span>
								<span class="target-par">
									<Stepper
										bind:value={target.par}
										min={0}
										disabled={target.rule === 'Bonus' || target.rule === 'Team_Bonus'}
									/>
								</span>
								<span class="target-rule">
									<Selector
										id="rule{target.id}"
										bind:value={target.rule}
										onchange={() =>
											(target.par =
												target.rule === 'Bonus' || target.rule === 'Team_Bonus' ? 0 : 4)}
										options={ruleOptions}
									/>
								</span>
								<span
									class="btn-actions btn-par"
									role="none"
									onclick={async () => editTarget(targets.indexOf(target))}>+</span
								>
							</div>
							<div role="none" class="handle">☰</div>
						</div>
					{/each}
				</div>
			</div>

			{#if isDragging}
				<div
					transition:fly={{ x: 100, duration: 300 }}
					class="delete-zone"
					use:dndzone={{ items: [] }}
					onfinalize={handleRemoveDrop}
				>
					<div class="trash-icon">🗑️</div>
					<p>Lâcher pour supprimer</p>
				</div>
			{/if}
		{:else}
			<p>Aucune cible n'a été définie</p>
		{/if}
	{/if}

	<ul>
		<li>sauvegarde</li>
		<li>récupération en cloud de cibles existantes</li>
	</ul>
</div>

{#each course?.targets as target, i}
	{#if isEditingTarget[i]}
		<TargetProps
			{target}
			{isTeamGame}
			editTarget={() => editTarget(i)}
			removeTarget={() => removeTarget(target.id)}
		/>
	{/if}
{/each}

<style>
	.targets-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		min-height: 50px; /* Important pour pouvoir redéposer dans une liste vide */
	}

	.target-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: var(--bg-card);
		border: 1px solid var(--border-color);
		border-radius: 8px;
		padding: 0.5rem;
		touch-action: shadow; /* Aide à la gestion tactile */
	}

	.target-par {
		width: 32%;
	}

	.target-name {
		width: 28%;
	}

	.target-rule {
		width: 25%;
	}
</style>
