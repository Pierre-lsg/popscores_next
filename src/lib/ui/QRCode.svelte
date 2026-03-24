<script lang="ts">
	import QRCode from 'qrcode';
	import { onMount } from 'svelte';

	interface Props {
		data: string; // L'URL ou le texte à encoder
		size?: number; // Taille en pixels
		color?: string; // Couleur des modules
	}

	let { data, size = 200, color = '#000000' }: Props = $props();
	let canvas: HTMLCanvasElement | undefined = $state();

	// On utilise un effet pour régénérer le QR Code si la donnée change
	$effect(() => {
		if (canvas && data) {
			QRCode.toCanvas(
				canvas,
				data,
				{
					width: size,
					margin: 2,
					color: {
						dark: color,
						light: '#ffffff'
					}
				},
				(error) => {
					if (error) console.error('Erreur QR Code:', error);
				}
			);
		}
	});
</script>

<div class="qr-container">
	<canvas bind:this={canvas}></canvas>
</div>

<style>
	.qr-container {
		display: flex;
		justify-content: center;
		padding: 1rem;
		background: white; /* Fond blanc important pour le flashage */
		border-radius: 12px;
		width: fit-content;
		margin: 0 auto;
	}

	canvas {
		max-width: 100%;
		height: auto !important;
	}
</style>
