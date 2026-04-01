<script lang="ts">
	import Stepper from '$lib/ui/Stepper.svelte';
	import Selector from '$lib/ui/Selector.svelte';
	import Param from '$lib/ui/Param.svelte';
	import Map from '$lib/ui/Map.svelte';
	import ParamTextArea from '$lib/ui/ParamTextArea.svelte';
	import type { Target } from '$lib/types/targetType';
	import GolfSCourse from './GolfSCourse.svelte';
	import { coursesStore } from '$lib/stores/quickSession/coursesStore.svelte';

	import { slide, fly } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { dndzone } from 'svelte-dnd-action';
	import { getGPS } from '$lib/utils/sharedFunction';
	import { calculateDistance, type GPSCoords } from '$lib/utils/sharedFunction';

	import { individualRules, collectiveRules } from '$lib/types/targetType';

	import { sessionSettingsStore } from '$lib/stores/gameSessionStore.svelte';
	import { targetsStore } from '$lib/stores/quickSession/targetsStore.svelte';
	import { playersStore } from '$lib/stores/quickSession/playersStore.svelte';
	import { gameStatus } from '$lib/stores/gameStatusStore.svelte';
	import Loader from '$lib/ui/Loader.svelte';
	import TextField from '$lib/ui/TextField.svelte';

	let isTeamGame: boolean = sessionSettingsStore.settings.regulation.teamGame;

	let isDragging = $state(false);
	let isEditingTarget: boolean[] = $state([]);
	let isEditing: boolean = $state(false);
	let loadingGps = $state(false);
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
	};

	async function setPosition(type: 'start' | 'end', target: Target) {
		let confirmedPositionning = true;
		if ((type === 'start' && target.start_pos.lat) || (type === 'end' && target.end_pos.lat))
			confirmedPositionning = confirm('Voulez-vous redéfinir les positions ? ');
		if (confirmedPositionning) {
			loadingGps = true;
			try {
				const coords = (await getGPS()) as GPSCoords;
				if (type === 'start') target.start_pos = coords;
				else target.end_pos = coords;
			} catch (err) {
				alert('Erreur GPS : ' + err);
			} finally {
				loadingGps = false;
			}
		}
	}

	const displayDistance = (target: Target) => {
		if (target.start_pos && target.end_pos) {
			const distance = Math.round(calculateDistance(target.start_pos, target.end_pos));
			if (distance) return distance + ' m';
			else return '???';
		} else return '???';
	};

	const selectCourse = () => {
		//
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
		<div class="flex-form">
			<Param
				label="⛳ Nom de la cible"
				type="text"
				bind:value={target.name}
				placeholder="Nom de la cible"
				focus={true}
			/>
			<Stepper label="Par" value={target.par} onchange={(val) => (target.par = val)} />
			<Selector
				label="Règle"
				id="rule{target.id}"
				bind:value={target.rule}
				options={ruleOptions}
				onchange={() =>
					(target.par = target.rule === 'Bonus' || target.rule === 'Team_Bonus' ? 0 : 4)}
			/>
			<div class="hole-card">
				<div class="flex gap-2">
					<ParamTextArea
						label="Description"
						placeholder="Description du cadre de la cible ..."
						bind:value={target.description}
					/>
					Distance : {displayDistance(target)}
					<ParamTextArea
						label="Règles spécifiques"
						placeholder="Les parterres de fleurs sont hors limite ..."
						bind:value={target.optional_rules}
					/>

					<button onclick={() => setPosition('start', target)} class:active={target.start_pos}>
						{target.start_pos.lat ? '🚩 Départ fixé. Redéfinir ?' : '📍 Fixer le départ'}
					</button>
					<ParamTextArea
						label="Emplacement de départ"
						placeholder="Détails du départ : devant la plaque ..."
						bind:value={target.start_details}
					/>

					<button onclick={() => setPosition('end', target)} class:active={target.end_pos}>
						{target.end_pos.lat ? '🎯 Arrivée fixée. Redéfinir ?' : "📍 Fixer l'arrivée"}
					</button>
					<ParamTextArea
						label="Emplacement de la cible"
						placeholder="Toucher la borne. -1 si la balle reste ..."
						bind:value={target.end_details}
					/>
				</div>
				<div class="map-container">
					{#if target.start_pos.lat && target.end_pos.lat}
						<Map start_pos={target.start_pos} end_pos={target.end_pos} />
					{/if}
				</div>
			</div>
			<div class="action">
				<button onclick={() => editTarget(i)}>Valider</button>
				<button onclick={() => removeTarget(target.id)}> 🗑️ </button>
			</div>
		</div>
	{/if}

	{#if loadingGps}
		<div class="box-screen splash-screen">
			<Loader message="Recherche de position GPS ..." />
		</div>
	{/if}
{/each}
