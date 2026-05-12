<script lang="ts">
	import { confirmStore } from '$lib/stores/confirmStore.svelte';
	import type { Target } from '$lib/types/targetType';
	import { individualRules, collectiveRules } from '$lib/types/targetType';
	import { calculateDistance, type GPSCoords } from '$lib/utils/sharedFunction';
	import { getGPS } from '$lib/utils/sharedFunction';
	import { onMount } from 'svelte';

	import Param from '$lib/ui/Param.svelte';
	import Stepper from '$lib/ui/Stepper.svelte';
	import Selector from '$lib/ui/Selector.svelte';
	import ParamTextArea from '$lib/ui/ParamTextArea.svelte';
	import Map from '$lib/ui/Map.svelte';
	import Loader from '$lib/ui/Loader.svelte';
	import { toastStore } from '$lib/stores/toastStore.svelte';

	interface Props {
		target: Target;
		isTeamGame: boolean;
		editTarget?: () => void;
		removeTarget?: () => void;
	}

	let { target = {} as Target, isTeamGame = false, editTarget, removeTarget }: Props = $props();

	let loadingGps = $state(false);
	const ruleOptions = $derived(isTeamGame ? collectiveRules : individualRules);

	async function setPosition(type: 'start' | 'end', target: Target) {
		let confirmedPositionning = true;
		if ((type === 'start' && target.start_pos.lat) || (type === 'end' && target.end_pos.lat))
			confirmedPositionning = await confirmStore.prompt('Voulez-vous redéfinir les positions ? ');
		if (confirmedPositionning) {
			loadingGps = true;
			try {
				const coords = (await getGPS()) as GPSCoords;
				if (type === 'start') target.start_pos = coords;
				else target.end_pos = coords;
			} catch (err) {
				toastStore.show('Erreur GPS : ' + err, 'failure', 0);
			} finally {
				loadingGps = false;
			}
		}
	}

	const displayDistance = async (target: Target) => {
		if (target.start_pos && target.end_pos) {
			const distance = Math.round(calculateDistance(target.start_pos, target.end_pos));
			if (distance) return distance + ' m';
			else return '???';
		} else return '???';
	};

	onMount(() => {
		// editTarget();
	});
</script>

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
		onchange={() => (target.par = target.rule === 'Bonus' || target.rule === 'Team_Bonus' ? 0 : 4)}
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

			<button onclick={async () => setPosition('start', target)} class:active={target.start_pos}>
				{target.start_pos.lat ? '🚩 Départ fixé. Redéfinir ?' : '📍 Fixer le départ'}
			</button>
			<ParamTextArea
				label="Emplacement de départ"
				placeholder="Détails du départ : devant la plaque ..."
				bind:value={target.start_details}
			/>

			<button onclick={async () => setPosition('end', target)} class:active={target.end_pos}>
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
		<button onclick={async () => editTarget?.()}>Valider</button>
		<button onclick={async () => removeTarget?.()}> 🗑️ </button>
	</div>
</div>

{#if loadingGps}
	<div class="box-screen splash-screen">
		<Loader message="Recherche de position GPS ..." />
	</div>
{/if}
