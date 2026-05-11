import fs from 'fs';
import path from 'path';

const colorMap = {
	// Succès
	'#248724': 'var(--color-success)',
	'#22c55e': 'var(--color-success)',
	'#388e3c': 'var(--color-success)',
	darkgreen: 'var(--color-success)',

	// Alertes / Danger
	'#ff3030': 'var(--color-alert)',
	'#c62828': 'var(--text-on-status)', // Pour le texte sur les anciens fonds roses
	'#ffcdd2': 'var(--color-alert)', // Remplacement des fonds roses par le rouge sémantique
	'#ef5350': 'var(--color-alert)',
	'#b71c1c': 'var(--color-alert)',
	'#ef4444': 'var(--color-alert)',
	darkred: 'var(--color-alert)',

	// Infos / Bleu
	'#2855c6': 'var(--text-on-status)',
	'#cdcdff': 'var(--color-info)',
	'#039be5': 'var(--color-info)',

	// Avertissements
	'#ff7f30': 'var(--color-warning)',
	'#e65100': 'var(--color-warning)',

	// Primaire
	'#4338ca': 'var(--primary)',

	// Neutres et Bordures
	'#cccccc': 'var(--border-color)',
	'#ccc': 'var(--border-color)',
	'#dddddd': 'var(--border-color)',
	'#ddd': 'var(--border-color)',
	'#eeeeee': 'var(--bg-card)',
	'#eee': 'var(--bg-card)',
	'#efefef': 'var(--bg-card)',
	'#f9fafb': 'var(--bg-app)',
	'#666666': 'var(--secondary)',
	'#666': 'var(--secondary)'
};

function replaceColorsInFile(filePath) {
	let content = fs.readFileSync(filePath, 'utf-8');
	let changed = false;

	// Si c'est un fichier Svelte, on ne cherche que dans le bloc <style>
	if (filePath.endsWith('.svelte')) {
		const styleRegex = /<style>([\s\S]*?)<\/style>/g;
		content = content.replace(styleRegex, (match, styleContent) => {
			let newStyleContent = styleContent;
			for (const [hex, cssVar] of Object.entries(colorMap)) {
				// Regex pour cibler la couleur en évitant les sous-chaînes (ex: #ccc et pas #cccccc)
				const regex = new RegExp(`(?<![a-zA-Z0-9_-])${hex}(?![a-zA-Z0-9])`, 'gi');
				if (regex.test(newStyleContent)) {
					newStyleContent = newStyleContent.replace(regex, cssVar);
					changed = true;
				}
			}
			return `<style>${newStyleContent}</style>`;
		});
	} 
	// Si c'est app.css, on remplace globalement (sauf la définition des variables elles-mêmes)
	else if (filePath.endsWith('app.css')) {
		// On remplace juste dans les classes (on exclut les lignes qui définissent --color)
		let lines = content.split('\n');
		for (let i = 0; i < lines.length; i++) {
			if (!lines[i].includes('--color')) {
				for (const [hex, cssVar] of Object.entries(colorMap)) {
					const regex = new RegExp(`(?<![a-zA-Z0-9_-])${hex}(?![a-zA-Z0-9])`, 'gi');
					if (regex.test(lines[i])) {
						lines[i] = lines[i].replace(regex, cssVar);
						changed = true;
					}
				}
			}
		}
		content = lines.join('\n');
	}

	if (changed) {
		fs.writeFileSync(filePath, content, 'utf-8');
		console.log(`🎨 Couleurs rationalisées dans : ${filePath.replace(process.cwd(), '')}`);
	}
}

function traverseDir(dir) {
	const files = fs.readdirSync(dir);
	for (const file of files) {
		const filePath = path.join(dir, file);
		if (fs.statSync(filePath).isDirectory()) {
			traverseDir(filePath);
		} else if (filePath.endsWith('.svelte')) {
			replaceColorsInFile(filePath);
		}
	}
}

console.log('Recherche et mise à jour des couleurs CSS...');
traverseDir(path.join(process.cwd(), 'src/lib'));
traverseDir(path.join(process.cwd(), 'src/routes'));
replaceColorsInFile(path.join(process.cwd(), 'src/app.css'));
console.log('✅ Nettoyage terminé !');
