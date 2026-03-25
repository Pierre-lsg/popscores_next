<script lang="ts">
	interface Props {
		message?: string;
	}

	let { message = 'Chargement du championnat...' }: Props = $props();
</script>

<div class="loader-container">
	{#if message}
		<p class="loader-message">{message}</p>
	{/if}
</div>

<style>
	.loader-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 16px;
		padding: 20px;
		width: 100%;
		height: 100%;
	}

	.loader-message {
		font-size: 2.5rem;
		color: var(--color-text-soft, #eee);
		font-weight: 500;
		text-align: center;
		/* Petite animation de pulsation du texte */
		animation: pulseText 1.5s ease-in-out infinite;
	}

	/* --- Keyframes des Animations --- */

	/* Pulsation discrète du texte */
	@keyframes pulseText {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.6;
		}
	}
</style>
