import fs from 'fs';
import path from 'path';

const filesToMove = [
  'GolfHeader.svelte',
  'PlayerScoreCard.svelte',
  'PlayerScoreCardByTarget.svelte',
  'PlayerScoreOrder.svelte',
  'TargetProps.svelte',
  'TeamCard.svelte',
  'TeamScoreCard.svelte',
  'TeamScoreCardByTarget.svelte',
  'TeamScoreOrder.svelte'
];

const sourceDir = path.join(process.cwd(), 'src/lib/ui');
const targetDir = path.join(process.cwd(), 'src/lib/components/core_game');
const srcDir = path.join(process.cwd(), 'src');

// 1. Création du dossier et déplacement
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

let movedCount = 0;
filesToMove.forEach(file => {
  const sourcePath = path.join(sourceDir, file);
  const targetPath = path.join(targetDir, file);
  if (fs.existsSync(sourcePath)) {
    fs.renameSync(sourcePath, targetPath);
    console.log(`✅ Déplacé : ${file}`);
    movedCount++;
  }
});

// 2. Mise à jour des imports
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
      filesToMove.forEach(component => {
        const oldImport = `$lib/ui/${component}`;
        const newImport = `$lib/components/core_game/${component}`;
        if (content.includes(oldImport)) {
          content = content.replaceAll(oldImport, newImport);
          changed = true;
        }
      });
      if (changed) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`🔄 Mis à jour : ${filePath.replace(process.cwd(), '')}`);
      }
    }
  }
}

console.log("Recherche et mise à jour des imports...");
replaceInFiles(srcDir);
console.log("Terminé !");
