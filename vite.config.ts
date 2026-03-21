import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
import mkcert from 'vite-plugin-mkcert';

export default defineConfig({
	plugins: [
		mkcert(),
		sveltekit(),
		SvelteKitPWA({
			registerType: 'autoUpdate',
			injectRegister: 'auto',
			//strategies: 'injectManifest',
			workbox: {
				globPatterns: ['**/*.{js,css,json,html,png,txt,webmanifest,ico,.htaccess}']
			},
			manifest: {
				name: 'Popscores',
				short_name: 'Popscores',
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
					}
				]
			}
		})
	]
});
