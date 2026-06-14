<script lang="ts">
	import { toggleDictation } from '$lib/utils/sharedFunction';
	import { onMount } from 'svelte';

	interface Props {
		label?: string;
		value: string;
		placeholder?: string;
		rows?: number;
		focus?: boolean;
		onchange?: () => void;
	}

	let {
		label = '',
		value = $bindable(''),
		placeholder = '',
		rows = 3, // Hauteur par défaut
		focus = false,
		onchange
	}: Props = $props();

	// Utilisation de la même logique d'initialisation pour le focus
	const init = (elt: HTMLTextAreaElement) => {
		if (focus) elt.focus();
	};

	let isListening = $state(false);
	let isSupported = $state(false);
	let recognition: unknown = null;

	async function handleVoice() {
		isListening = !isListening;
		try {
			const text = await toggleDictation(recognition, isListening);
			// On concatène si le champ n'est pas vide
			value = value ? `${value} ${text}` : text;
		} catch (err) {
			console.error(err);
			// Optionnel : afficher une petite notification d'erreur ici
		} finally {
			isListening = false;
		}
	}

	onMount(() => {
		isSupported = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
	});
</script>

<div class="param-container">
	{#if label}
		<label for="textarea-field">{label}</label>
	{/if}

	{#if isSupported}
		<button type="button" onclick={handleVoice} class="btn-mic" class:recording={isListening}>
			{isListening ? '⏹️ Écoute...' : '🎤 Dicter'}
		</button>
	{/if}

	<textarea id="textarea-field" {placeholder} {rows} bind:value use:init {onchange}></textarea>
</div>

<style>
	.btn-mic {
		align-self: flex-start;
		padding: 6px 16px;
		border-radius: 20px;
		border: 1px solid var(--border-color);
		background: var(--bg-card);
		color: var(--text-main);
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s;
		margin-bottom: 4px;
	}

	/* Animation de pulsation quand on enregistre */
	.recording {
		background: var(--color-alert);
		border-color: var(--color-alert);
		color: white;
		animation: pulse 1.5s infinite;
	}

	@keyframes pulse {
		0% {
			transform: scale(1);
			opacity: 1;
		}
		50% {
			transform: scale(1.05);
			opacity: 0.8;
		}
		100% {
			transform: scale(1);
			opacity: 1;
		}
	}
</style>
