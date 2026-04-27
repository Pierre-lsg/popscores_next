<script lang="ts">
	import Stepper from '$lib/ui/Stepper.svelte';
	import Selector from '$lib/ui/Selector.svelte';
	import GolfSCourse from './GolfSCourse.svelte';
	import { coursesStore } from '$lib/stores/quickSession/coursesStore.svelte';

	import { slide, fly } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { dndzone } from 'svelte-dnd-action';

	import { individualRules, collectiveRules } from '$lib/types/targetType';

	import { sessionSettingsStore } from '$lib/stores/gameSessionStore.svelte';
	import { targetsStore } from '$lib/stores/quickSession/targetsStore.svelte';
	import { playersStore } from '$lib/stores/quickSession/playersStore.svelte';
	import { gameStatus } from '$lib/stores/gameStatusStore.svelte';
	import TextField from '$lib/ui/TextField.svelte';
	import TargetProps from '$lib/ui/TargetProps.svelte';

	let isTeamGame: boolean = sessionSettingsStore.settings.regulation.teamGame;

	let isDragging = $state(false);
	let isEditingTarget: boolean[] = $state([]);
	let isEditing: boolean = $state(false);
	let isSelectingCourse = $state(false);
	let isCourseSelected = $state(!!targetsStore.list.length || coursesStore.list.length === 0);

	// Set rule options based on whether it's a team game or not
	const ruleOptions = isTeamGame ? collectiveRules : individualRules;
	const flipDurationMs = 300;

	// Set the default value of newTargetRule to the first item in ruleOptions
	let newTargetRule = $state(ruleOptions[0]);

	// Function to add a new target to targetsStore with specified parameters
	const addTarget = () => {
		targetsStore.add(
			newTargetRule === 'Bonus' || newTargetRule === 'Team_Bonus' ? 0 : 4,
			'Une cible',
			newTargetRule
		);
		gameStatus.currentTargetIndex = 0;
		isCourseSelected = true;
	};

	// Function to handle the removal of a target from dndzone
	const handleRemoveDrop = (e: CustomEvent<{ items: any[] }>) => {
		const removedItem = e.detail.items[0];
		if (removedItem) {
			targetsStore.list = targetsStore.list.filter((h) => h.id !== removedItem.id);
		}
		playersStore.cleanOrphanScores(targetsStore.list.map((h) => h.id));
		gameStatus.currentTargetIndex = 0;
		isDragging = false;
	};

	// Function to handle the consideration of a target in dndzone
	const handleConsider = () => {
		isDragging = true;
	};

	// Function to finalize the reordering of targets in dndzone
	const handleFinalize = (e: CustomEvent<{ items: any[] }>) => {
		targetsStore.list = e.detail.items;
		isDragging = false;
	};

	const editTarget = (id: number) => {
		isEditingTarget[id] = !isEditingTarget[id];
		for (let i = 0; i < isEditingTarget.length; i++) {
			if (i !== id) isEditingTarget[i] = false;
		}
		isEditing = isEditingTarget[id];
	};

	const removeTarget = (id: string) => {
		if (confirm('Voulez-vous vraiment supprimer cette cible ?')) {
			targetsStore.removeById(id);
		}
		isEditingTarget.fill(false);
		isEditing = false;
	};

	const selectCourse = () => {
		isSelectingCourse = true;
	};
</script>

<div class="step-content" in:slide>
	{#if !isEditing}
		<button onclick={() => addTarget()} class="btn-large btn-primary">Ajouter une cible ≡</button>
	{/if}
	{#if !isCourseSelected}
		<button onclick={() => selectCourse()} class="btn-large btn-primary"
			>Sélectionner un précédent parcours ≡</button
		>
	{/if}

	{#if isSelectingCourse}
		<GolfSCourse bind:isSelectingCourse bind:isCourseSelected />
	{/if}

	{#if !isEditing}
		<div
			class="flex-list"
			use:dndzone={{
				items: targetsStore.list,
				flipDurationMs,
				dropTargetStyle: { outline: '2px dashed var(--primary)', borderRadius: '8px' }
			}}
			onconsider={(e) => {
				handleConsider();
				targetsStore.list = e.detail.items;
			}}
			onfinalize={handleFinalize}
		>
			{#each targetsStore.list as target (target.id)}
				<div class="flex-item" animate:flip={{ duration: flipDurationMs }}>
					<div class="content">
						<TextField bind:value={target.name} />
						<Stepper
							label=""
							bind:value={target.par}
							min={0}
							disabled={target.rule === 'Bonus' || target.rule === 'Team_Bonus'}
						/>
						<Selector
							id="rule{target.id}"
							bind:value={target.rule}
							onchange={() =>
								(target.par = target.rule === 'Bonus' || target.rule === 'Team_Bonus' ? 0 : 4)}
							options={ruleOptions}
						/>
						<span
							class="btn-actions btn-par"
							role="none"
							onclick={() => editTarget(targetsStore.list.indexOf(target))}>+</span
						>
					</div>
					<div class="handle">☰</div>
				</div>
			{/each}
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
	{/if}
</div>

{#each targetsStore.list as target, i}
	{#if isEditingTarget[i]}
		<TargetProps
			{target}
			{isTeamGame}
			editTarget={() => editTarget(i)}
			removeTarget={() => removeTarget(target.id)}
		/>
	{/if}
{/each}
