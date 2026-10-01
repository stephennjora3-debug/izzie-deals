import fs from 'fs';
import path from 'path';

const appDir = path.join(process.cwd(), 'src', 'app');

console.log('Checking existing routes in src/app...\n');

function listRoutes(dir, indent = '') {
  const items = fs.readdirSync(dir, { withFileTypes: true });
  
  items.forEach(item => {
    if (item.isDirectory()) {
      if (item.name !== 'api' && !item.name.startsWith('.')) {
        console.log(indent + '📁 ' + item.name);
        listRoutes(path.join(dir, item.name), indent + '  ');
      }
    } else if (item.name === 'page.tsx' || item.name === 'route.ts') {
      const relativePath = path.relative(appDir, dir);
      console.log(indent + ' ' + (relativePath || 'root') + '/' + item.name);
    }
  });
}

listRoutes(appDir);

console.log('\n✅ Route check complete.');