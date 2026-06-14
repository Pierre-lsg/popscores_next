const fs = require('fs');
const path = require('path');

const dir = './src/lib/utils/pocketbase';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts'));

for (const file of files) {
  const content = fs.readFileSync(path.join(dir, file), 'utf8');
  // extract the Type in <{ data: Type }>
  const match = content.match(/db\.getFullList<\{ data: ([^ ]+) \}>/);
  if (match) {
    const type = match[1];
    // check if it's imported or defined
    const hasImport = content.includes(type);
    if (!hasImport) {
      console.log(`${file} uses ${type} but might not import it.`);
    } else {
      // It's in the file, but let's check if it's actually imported as `import ... type ...`
      const importRegex = new RegExp(`import.*${type}.*from`);
      if (!importRegex.test(content) && !content.includes(`interface ${type}`) && !content.includes(`type ${type}`)) {
         console.log(`${file} has ${type} but might not properly import it. (check manually)`);
      }
    }
  }
}
