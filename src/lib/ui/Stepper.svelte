<script lang="ts">
	interface Props {
		value: number;
		min?: number;
		max?: number;
		label?: string;
		disabled?: boolean;
		onchange?: (val: number) => void;
	}

	let {
		value = $bindable(0),
		min = 0,
		max = Infinity,
		label = '',
		disabled = false,
		onchange
	}: Props = $props();

	let timer: ReturnType<typeof setInterval> | null = null;
	let delayTimer: ReturnType<typeof setTimeout> | null = null;

	let isEditing: boolean = $state(false);
	let localValue: number = $state(0);

	const update = (newValue: number) => {
		if (disabled) return;
		if (newValue >= min && newValue <= max) {
			value = newValue;
			onchange?.(value);
		}
	};

	// Gestion de l'appui long
	const start = (e: Event, step: number) => {
		if (e.cancelable) e.preventDefault();
		stop(); // Sécurité : on nettoie tout timer précédent
		update(value + step); // Premier clic immédiat

		delayTimer = setTimeout(() => {
			timer = setInterval(() => {
				const next = value + step;
				if (next >= min && next <= max) {
					update(next);
				} else {
					stop();
				}
			}, 100); // Vitesse de défilement (10 fois par seconde)
		}, 500); // Délai avant de commencer à répéter
	};

	const stop = () => {
		if (delayTimer) clearTimeout(delayTimer);
		if (timer) clearInterval(timer);
		isEditing = false;
	};

	const editValue = () => {
		localValue = value;
		isEditing = true;
	};
</script>

<div class="stepper-container">
	{#if label}<span class="label">{label}</span>{/if}
	<div class="controls">
		<button
			type="button"
			class="btn-step"
			{disabled}
			onpointerdown={(e) => start(e, -1)}
			onpointerup={stop}
			onpointerleave={stop}
			ontouchend={stop}
			style="touch-action: none;"
			><span aria-hidden="true" style="pointer-events: none;">-</span>
		</button>

		{#if isEditing}
			<input
				type="number"
				class="value-input"
				bind:value={localValue}
				{min}
				{max}
				onblur={() => {
					update(localValue);
					isEditing = false;
				}}
			/>
		{:else}
			<div role="none" class="value-display" onclick={editValue}>{value}</div>
		{/if}

		<button
			type="button"
			class="btn-step"
			{disabled}
			onpointerdown={(e) => start(e, 1)}
			onpointerup={stop}
			onpointerleave={stop}
			ontouchend={stop}
			style="touch-action: none;"
			><span aria-hidden="true" style="pointer-events: none;">+</span>
		</button>
	</div>
</div>

<style>
	/* Ajoute un petit effet visuel quand on appuie */
	.btn-step:active {
		background-color: var(--primary);
		color: white;
		transform: scale(0.95);
	}
	.value-display {
		min-width: 2rem;
		text-align: center;
		font-weight: bold;
		font-size: 1.2rem;
	}

	.stepper-container {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.5rem;
		background: var(--bg-card);
		border-radius: 8px;
		margin-bottom: 0.5rem;
	}
	.controls {
		display: flex;
		align-items: center;
		gap: 0rem;
	}
	.btn-step {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		border: 1px solid var(--primary);
		font-size: 1.5rem;
		color: var(--primary);
		touch-action: none;
		-webkit-user-select: none;
		user-select: none;
		background-color: var(--bg-ui);
		margin: 0;
		padding: 0;
	}
	.value-display {
		font-size: 1.2rem;
		font-weight: bold;
		min-width: 30px;
		text-align: center;
	}
</style>
