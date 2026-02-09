<script lang="ts">
	import type { Competition } from '$lib/types/competitionType';
	import { collectiveRules, type Target } from '$lib/types/targetsType';
	import type { Course } from '$lib/types/courseType';

	import { dndzone } from 'svelte-dnd-action';
	import { slide, fly } from 'svelte/transition';
	import { flip } from 'svelte/animate';

	import CompetitionMenu from './CompetitionMenu.svelte';
	import Param from '$lib/ui/Param.svelte';
	import Stepper from '$lib/ui/Stepper.svelte';
	import Selector from '$lib/ui/Selector.svelte';

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

	const flipDurationMs = 200;
	let isDragging = $state(false);

	onMount(() => {
		if (currentCompetition) {
			let tempCourse = coursesChampionshipStore.find(currentCompetition.courseId);
			// Charger le parcours s'il existe
			if (tempCourse) course = tempCourse;
			else {
				course = coursesChampionshipStore.new();
				currentCompetition.courseId = course.id;
			}
			targets = course.targets;
		}
	});

	const addNewTarget = () => {
		if (course) course.targets.push(targetsChampionshipStore.new());
	};

	const editTarget = (id: number) => {
		editingTarget[id] = !editingTarget[id];
		for (let i = 0; i < editingTarget.length; i++) {
			if (i !== id) editingTarget[i] = false;
		}
	};

	// Drag & drop functions
	const handleConsider = () => {
		isDragging = true;
		editingTarget = editingTarget.map(() => false);
	};

	const handleFinalize = (e: CustomEvent<{ items: any[] }>) => {
		targets = e.detail.items;
		if (course) course.targets = targets;
		isDragging = false;
	};

	const handleRemoveDrop = (e: CustomEvent<{ items: any[] }>) => {
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
	<h3>Liste des cibles</h3>
	{#if course && targets.length > 0}
		<button onclick={() => addNewTarget()}>Ajouter une cible</button>

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
							<span class="target-name">{target.name || 'Trou #'}</span>
							<span class="target-par">{target.par}</span>
							<span class="target-rule">{target.rule}</span>
							<span>
								<span role="none" onclick={() => editTarget(targets.indexOf(target))}>✏️</span>
							</span>
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

		<div>&nbsp;</div>
		{#each course?.targets as target, i}
			{#if editingTarget[i]}
				<Param
					label="⛳ Nom de la cible"
					type="text"
					bind:value={target.name}
					placeholder="Nom de la cible"
					focus={true}
					oneline={true}
				/>
				<Stepper label="Par" value={target.par} onchange={(val) => (target.par = val)} />
				<Selector
					label="Règle"
					id="rule{target.id}"
					bind:value={target.rule}
					options={ruleOptions}
					onchange={() => (target.par = target.rule === 'Bonus' ? 0 : 4)}
				/>
				<p class="param-container">
					Autres params à définir plus tard (départ, arrivée, GPS photos, ...)
				</p>
			{/if}
		{/each}
	{:else}
		<p>Aucune cible n'a été définie</p>
	{/if}

	<ul>
		<li>sauvegarde</li>
		<li>récupération en cloud de cibles existantes</li>
	</ul>
</div>

<style>
	.param-container {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.5rem;
		background: var(--bg-card);
		border-radius: 8px;
		margin-bottom: 0.5rem;
	}

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
		width: 5%;
	}

	.target-name {
		width: 40%;
	}

	.target-rule {
		width: 40%;
	}
</style>
