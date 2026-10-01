import fs from 'fs';
import path from 'path';

console.log('Searching for Header/Navigation components...\n');

const srcDir = path.join(process.cwd(), 'src');
const keywords = ['admin', 'add-product', 'orders', 'header', 'nav', 'navbar'];

function searchFiles(dir) {
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory() && item.name !== 'node_modules' && item.name !== '.next') {
      searchFiles(fullPath);
    } else if (item.isFile() && (item.name.endsWith('.tsx') || item.name.endsWith('.ts'))) {
      try {
        const content = fs.readFileSync(fullPath, 'utf8').toLowerCase();
        if (keywords.some(kw => content.includes(kw))) {
          const relativePath = path.relative(process.cwd(), fullPath);
          console.log('- ' + relativePath);
        }
      } catch (e) {
        // Ignore read errors
      }
    }
  }
}

searchFiles(srcDir);

console.log('\n✅ Search complete. Please copy this list and paste it here.');
console.log('I will then read the most likely candidate (e.g., src/components/layout/Header.tsx) to add the admin check.');