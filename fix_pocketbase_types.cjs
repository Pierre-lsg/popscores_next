const fs = require('fs');
const path = require('path');

const dir = './src/lib/utils/pocketbase';
const mapping = {
  'championships2Cloud.ts': 'Championship',
  'clubs2Cloud.ts': 'Club',
  'competitions2Cloud.ts': 'Competition',
  'courses2Cloud.ts': 'Course',
  'flys2Cloud.ts': 'Fly',
  'history2Cloud.ts': 'Session',
  'players2Cloud.ts': 'Player',
  'regulations2Cloud .ts': 'Regulations',
  'scoreCards2Cloud.ts': 'ScoreCard',
  'target2Cloud.ts': 'Target',
  'teams2Cloud.ts': 'Team',
  'users2Cloud.ts': 'User'
};

for (const [filename, type] of Object.entries(mapping)) {
  const filePath = path.join(dir, filename);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    // We want to replace `db.getFullList('` with `db.getFullList<{ data: Type }>('`
    // but only when it is awaited or used where data is accessed.
    // Actually, replacing all `db.getFullList('` should be safe if we type it.
    
    // For users2Cloud.ts, it also has `: any` we might want to clean up, but let's just do the `getFullList` first.
    content = content.replace(/db\.getFullList\('/g, `db.getFullList<{ data: ${type} }>('`);
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${filename}`);
  }
}
