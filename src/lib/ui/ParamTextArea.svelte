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
	let recognition: any = null;

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
		isSupported = !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
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
	.param-container {
		display: flex;
		flex-direction: column;
		gap: 8px;
		margin-bottom: 1.2rem;
		width: 100%;
	}

	label {
		font-weight: 600;
		font-size: 1rem;
		color: var(--color-text-soft, #555);
		text-align: left;
	}

	textarea {
		padding: 12px;
		border: 2px solid #e0e0e0;
		border-radius: 8px;
		font-size: 1rem;
		font-family: inherit; /* Pour éviter la police monospacée par défaut */
		transition: border-color 0.2s;
		outline: none;
		background-color: var(--bg-ui);
		resize: vertical; /* Permet à l'utilisateur d'ajuster la hauteur si besoin */
		line-height: 1.4;
	}

	textarea:focus {
		border-color: var(--border-color);
	}

	:global(.dark-mode) textarea {
		background: #222;
		color: white;
		border-color: var(--border-color);
	}

	.btn-mic {
		padding: 4px 12px;
		border-radius: 20px;
		border: 1px solid var(--border-color);
		background: white;
		transition: all 0.3s;
	}

	/* Animation de pulsation quand on enregistre */
	.recording {
		background: #ffeded;
		border-color: #ff4d4d;
		color: #ff4d4d;
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
