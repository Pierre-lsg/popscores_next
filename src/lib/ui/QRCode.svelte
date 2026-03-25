<script lang="ts">
	import QRCode from 'qrcode';

	interface Props {
		data: string;
		size?: number;
		color?: string;
	}

	let { data, size = 200, color = '#000000' }: Props = $props();
	let canvas: HTMLCanvasElement | undefined = $state();

	// https://www.npmjs.com/package/qrcode#qr-code-options
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
		background: white;
		border-radius: 12px;
		width: fit-content;
		margin: 0 auto;
	}

	canvas {
		max-width: 100%;
		height: auto !important;
	}
</style>
