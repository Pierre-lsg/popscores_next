import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';

export default defineConfig({
	plugins: [
		sveltekit(),
		SvelteKitPWA({
			registerType: 'autoUpdate',
			manifest: {
				name: 'Golf Score Hub',
				short_name: 'GolfScore',
				description: 'Suivi de score de golf en temps réel',
				start_url: '/popscores_next/',
				scope: '/popscores_next/',
				display: 'standalone',
				background_color: '#ffffff',
				theme_color: '#2e7d32',
				lang: 'fr',
				icons: [
					{
						src: 'pwa-192x192.png',
						sizes: '192x192',
						type: 'image/png'
					},
					{
						src: 'pwa-512x512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'any'
					},
					{
						src: 'pwa-512x512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'any maskable'
					}
				]
			},
			workbox: {
				globPatterns: [
					'client/**/*.{js,css,json}',
					'client/*.{png,txt,js,nojekyll,webmanifest,ico}'
				]
			}
		})
	]
});
