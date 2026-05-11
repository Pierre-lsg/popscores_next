<script lang="ts">
	import type { Target } from '$lib/types/targetType';
	import { swipe } from '$lib/utils/swipe';
	import TargetBox from '$lib/components/TargetBox.svelte';
	import Selector from '$lib/ui/Selector.svelte';
	import TextField from '$lib/ui/TextField.svelte';

	let {
		target = $bindable(),
		targets,
		activeTargetIndex,
		isFirstTarget = false,
		isLastTarget = false,
		allowEdit = false,
		allowSelect = false,
		onNext,
		onPrev,
		onTargetSelect,
		onModifyPar,
		onModifyRule
	} = $props<{
		target: Target;
		targets: Target[];
		activeTargetIndex: number;
		isFirstTarget?: boolean;
		isLastTarget?: boolean;
		allowEdit?: boolean;
		allowSelect?: boolean;
		onNext: () => void;
		onPrev: () => void;
		onTargetSelect?: (index: number) => void;
		onModifyPar?: () => void;
		onModifyRule?: () => void;
	}>();

	let showDetails = $state(false);
	let isSelectingTarget = $state(false);
	let selectedTarget = $state(String(activeTargetIndex));

	const changeTarget = () => {
		if (onTargetSelect) {
			onTargetSelect(parseInt(selectedTarget));
		}
		isSelectingTarget = false;
	};

	let showPar = $derived(target.rule !== 'Bonus' && target.rule !== 'Team_Bonus');
</script>

<header
	role="none"
	class="target-header"
	use:swipe={{ onRight: onNext, onLeft: onPrev }}
>
	<button class="btn-target" onclick={onPrev} disabled={isFirstTarget}>◀</button>
	
	<div class="target-info">
		{#if allowEdit}
			<h3>
				<TextField bind:value={target.name} />&nbsp;(#&nbsp;{activeTargetIndex + 1})
			</h3>
		{:else if allowSelect}
			{#if !isSelectingTarget}
				<h3 role="none" onclick={() => (isSelectingTarget = true)}>
					{target.name} (# {activeTargetIndex + 1})
				</h3>
			{:else}
				<Selector
					id="targetSelection"
					bind:value={selectedTarget}
					options={targets.map((_, i) => String(i))}
					optionsLabel={targets.map((t) => t.name)}
					onchange={changeTarget}
				/>
			{/if}
		{:else}
			<h3>{target.name} (# {activeTargetIndex + 1})</h3>
		{/if}

		<div class="target-details">
			<span role="none" class="par-badge" onclick={onModifyRule || (() => {})}>
				{target.rule}
			</span>
			{#if showPar}
				<span role="none" class="par-badge" onclick={onModifyPar || (() => {})}>
					PAR {target.par}
				</span>
			{/if}
			<span role="none" class="par-badge" onclick={() => (showDetails = !showDetails)}>?</span>
		</div>
	</div>

	<button class="btn-target" onclick={onNext} disabled={isLastTarget}>▶</button>
</header>

{#if showDetails}
	<TargetBox {target} bind:showDetails />
{/if}
