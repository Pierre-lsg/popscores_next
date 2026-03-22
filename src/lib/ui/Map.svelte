<script lang="ts">
	import { onMount } from 'svelte';
	import { onDestroy } from 'svelte';
	import { getGPS } from '$lib/utils/sharedFunction';
	import L from 'leaflet';
	import 'leaflet/dist/leaflet.css';

	let { start_pos, end_pos } = $props();
	let mapElement: HTMLDivElement | undefined = $state();
	let map: L.Map;

	onMount(async () => {
		const myPosition = await getGPS();
		const myIcon = L.divIcon({ className: 'my-div-icon' });

		if (!start_pos.lat) return;

		// Initialisation de la carte centrée sur le départ
		if (mapElement && start_pos) {
			map = L.map(mapElement).setView([start_pos.lat, start_pos.lng], 16);

			// Ajout de la couche OpenStreetMap
			L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution: '© OpenStreetMap contributors'
			}).addTo(map);
		}

		// Ma position
		if (myPosition)
			L.marker([myPosition.lat, myPosition.lng], { icon: myIcon }).addTo(map).bindPopup('Moi');

		// Marqueur Départ (Rouge)
		L.marker([start_pos.lat, start_pos.lng]).addTo(map).bindPopup('Départ');

		// Si on a une arrivée, on l'ajoute et on trace une ligne
		if (end_pos) {
			L.marker([end_pos.lat, end_pos.lng]).addTo(map).bindPopup('Arrivée');

			// Trace la ligne droite entre les deux
			const line = L.polyline(
				[
					[start_pos.lat, start_pos.lng],
					[end_pos.lat, end_pos.lng]
				],
				{ color: 'green', dashArray: '5, 10' }
			).addTo(map);

			// Ajuste le zoom pour voir les deux points
			map.fitBounds(line.getBounds(), { padding: [20, 20] });
		}
	});

	onDestroy(() => {
		if (map) map.remove();
	});
</script>

<div bind:this={mapElement} class="h-64 w-full rounded-lg shadow-inner"></div>

<style>
	/* Important : Leaflet a besoin d'une hauteur explicite */
	div {
		height: 250px;
	}
	:global(.my-div-icon) {
		background-color: red;
		border: 3px solid white;
		border-radius: 50%;
		box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
	}
</style>
