import fs from 'fs';
import path from 'path';

const userStoreContent = `import { pb } from '$lib/utils/pocketbase/pocketBase';
import type { AuthModel } from 'pocketbase';

class UserStore {
	current = $state<AuthModel | null>(pb.authStore.record);

	constructor() {
		pb.authStore.onChange(() => {
			this.current = pb.authStore.record;
		});
	}
}

export const userStore = new UserStore();
`;

// 1. Créer le nouveau userStore Svelte 5
const userStorePath = path.join(process.cwd(), 'src/lib/stores/userStore.svelte.ts');
fs.writeFileSync(userStorePath, userStoreContent);
console.log('✅ Créé : src/lib/stores/userStore.svelte.ts');

// 2. Nettoyer pocketBase.ts
const pocketBasePath = path.join(process.cwd(), 'src/lib/utils/pocketbase/pocketBase.ts');
let pbContent = fs.readFileSync(pocketBasePath, 'utf8');
pbContent = pbContent.replace("import { writable } from 'svelte/store';\n", '');
pbContent = pbContent.replace(/export const user = writable\(pb\.authStore\.record\);[\s\S]*?\}\);\n+/, '');
fs.writeFileSync(pocketBasePath, pbContent);
console.log('✅ Nettoyé : pocketBase.ts');

// 3. Remplacer les imports et $user dans tout le projet
function replaceInFiles(dir) {
	const files = fs.readdirSync(dir);
	for (const file of files) {
		const filePath = path.join(dir, file);
		const stat = fs.statSync(filePath);
		if (stat.isDirectory()) {
			replaceInFiles(filePath);
		} else if (filePath.endsWith('.svelte') || filePath.endsWith('.ts')) {
			let content = fs.readFileSync(filePath, 'utf-8');
			let changed = false;

			// Cas d'import spécifiques
			if (content.includes("import { user } from '$lib/utils/pocketbase/pocketBase'")) {
				content = content.replace(
					"import { user } from '$lib/utils/pocketbase/pocketBase'",
					"import { userStore } from '$lib/stores/userStore.svelte'"
				);
				changed = true;
			} else if (content.includes("import { pb, user } from './pocketbase/pocketBase'")) {
				content = content.replace(
					"import { pb, user } from './pocketbase/pocketBase'",
					"import { pb } from './pocketbase/pocketBase';\nimport { userStore } from '$lib/stores/userStore.svelte'"
				);
				changed = true;
			} else if (content.includes("import { user, pb } from '$lib/utils/pocketbase/pocketBase'")) {
				content = content.replace(
					"import { user, pb } from '$lib/utils/pocketbase/pocketBase'",
					"import { pb } from '$lib/utils/pocketbase/pocketBase';\n\timport { userStore } from '$lib/stores/userStore.svelte'"
				);
				changed = true;
			}

			// Remplacement du writable par le state
			if (content.includes('$user')) {
				content = content.replaceAll('$user', 'userStore.current');
				changed = true;
			}

			if (changed) {
				fs.writeFileSync(filePath, content, 'utf-8');
				console.log(`🔄 Mis à jour : ${filePath.replace(process.cwd(), '')}`);
			}
		}
	}
}

console.log('Recherche et mise à jour des composants...');
replaceInFiles(path.join(process.cwd(), 'src'));
console.log('🎉 Terminé ! L\'application est désormais 100% Svelte 5.');
