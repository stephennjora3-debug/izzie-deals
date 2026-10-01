import fs from 'fs';
import path from 'path';

const adminDir = path.join(process.cwd(), 'src', 'app', 'admin');
const middlewarePath = path.join(process.cwd(), 'src', 'middleware.ts');

console.log('Checking admin folder structure and middleware...\n');

if (fs.existsSync(adminDir)) {
  console.log('FILES IN src/app/admin:');
  function listFiles(dir, indent = '') {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    items.forEach(item => {
      if (item.isDirectory()) {
        listFiles(path.join(dir, item.name), indent + '  ');
      } else if (item.name === 'page.tsx' || item.name === 'layout.tsx' || item.name === 'route.ts') {
        const relativePath = path.relative(path.join(process.cwd(), 'src', 'app'), path.join(dir, item.name));
        console.log(indent + '- ' + relativePath);
      }
    });
  }
  listFiles(adminDir);
} else {
  console.log('WARNING: src/app/admin directory not found.');
}

console.log('\n========================================');
console.log('FILE: src/middleware.ts');
console.log('========================================');
if (fs.existsSync(middlewarePath)) {
  console.log(fs.readFileSync(middlewarePath, 'utf8'));
} else {
  console.log('WARNING: FILE NOT FOUND (We will create this to protect routes)');
}
console.log('========================================\n');

console.log('Check complete. Please copy the output above and paste it here.');