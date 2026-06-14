<script lang="ts">
	import { confirmStore } from '$lib/stores/confirmStore.svelte';
	import Stepper from '$lib/ui/Stepper.svelte';
	import Selector from '$lib/ui/Selector.svelte';
	import GolfSCourse from './GolfSCourse.svelte';
	import { coursesStore } from '$lib/stores/quickSession/coursesStore.svelte';

	import { slide, fly } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { dndzone } from 'svelte-dnd-action';

	import { individualRules, collectiveRules, type Target } from '$lib/types/targetType';

	import { sessionSettingsStore } from '$lib/stores/gameSessionStore.svelte';
	import { targetsStore } from '$lib/stores/quickSession/targetsStore.svelte';
	import { playersStore } from '$lib/stores/quickSession/playersStore.svelte';
	import { gameStatus } from '$lib/stores/gameStatusStore.svelte';
	import TextField from '$lib/ui/TextField.svelte';
	import TargetProps from '$lib/components/core_game/TargetProps.svelte';

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
	const addTarget = async () => {
		targetsStore.add(
			newTargetRule === 'Bonus' || newTargetRule === 'Team_Bonus' ? 0 : 4,
			'Une cible',
			newTargetRule
		);
		gameStatus.currentTargetIndex = 0;
		isCourseSelected = true;
	};

	// Function to handle the removal of a target from dndzone
	const handleRemoveDrop = async (e: CustomEvent<{ items: Target[] }>) => {
		const removedItem = e.detail.items[0];
		if (removedItem) {
			targetsStore.list = targetsStore.list.filter((h) => h.id !== removedItem.id);
		}
		playersStore.cleanOrphanScores(targetsStore.list.map((h) => h.id));
		gameStatus.currentTargetIndex = 0;
		isDragging = false;
	};

	// Function to handle the consideration of a target in dndzone
	const handleConsider = async () => {
		isDragging = true;
	};

	// Function to finalize the reordering of targets in dndzone
	const handleFinalize = async (e: CustomEvent<{ items: Target[] }>) => {
		targetsStore.list = e.detail.items;
		isDragging = false;
	};

	const editTarget = async (id: number) => {
		isEditingTarget[id] = !isEditingTarget[id];
		for (let i = 0; i < isEditingTarget.length; i++) {
			if (i !== id) isEditingTarget[i] = false;
		}
		isEditing = isEditingTarget[id];
	};

	const removeTarget = async (id: string) => {
		if (await confirmStore.prompt('Voulez-vous vraiment supprimer cette cible ?')) {
			targetsStore.removeById(id);
		}
		isEditingTarget.fill(false);
		isEditing = false;
	};

	const selectCourse = async () => {
		isSelectingCourse = true;
	};
</script>

<div class="step-content" in:slide>
	{#if !isEditing}
		<button onclick={async () => addTarget()} class="btn-large btn-primary">Ajouter une cible ≡</button>
	{/if}
	{#if !isCourseSelected}
		<button onclick={async () => selectCourse()} class="btn-large btn-primary"
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
					<div class="content target-layout">
						<!-- Ligne 1 : Nom de la cible -->
						<div class="target-name">
							<TextField bind:value={target.name} />
						</div>
						<!-- Ligne 2 : Contrôles -->
						<div class="target-controls">
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
							<button
								class="btn-icon target-settings-btn"
								onclick={async () => editTarget(targetsStore.list.indexOf(target))}
								title="Paramètres de la cible"
							>
								⚙️
							</button>
						</div>
					</div>
					<div class="handle target-handle">☰</div>
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

{#each targetsStore.list as target, i (i)}
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
	.target-layout {
		display: flex;
		flex-direction: column;
		gap: 10px;
		flex: 1;
		width: 100%;
	}

	.target-name {
		width: 100%;
		text-align: left;
		font-weight: 600;
	}

	.target-controls {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
	}

	.target-settings-btn {
		min-width: 38px;
		width: 38px;
		height: 38px;
		padding: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 50%;
		font-size: 1.1rem;
		margin: 0;
	}

	.target-handle {
		padding-left: 10px;
		display: flex;
		align-items: center;
	}
</style>
