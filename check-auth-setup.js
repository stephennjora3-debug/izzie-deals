import fs from 'fs';
import path from 'path';

const authDir = path.join(process.cwd(), 'src', 'app', 'auth');

console.log('Checking auth folder structure...\n');

if (fs.existsSync(authDir)) {
  console.log('FILES IN src/app/auth:');
  function listFiles(dir, indent = '') {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    items.forEach(item => {
      if (item.isDirectory()) {
        listFiles(path.join(dir, item.name), indent + '  ');
      } else if (item.name === 'page.tsx' || item.name === 'route.ts') {
        const relativePath = path.relative(path.join(process.cwd(), 'src', 'app'), path.join(dir, item.name));
        console.log(indent + '- ' + relativePath);
      }
    });
  }
  listFiles(authDir);
} else {
  console.log('WARNING: src/app/auth directory not found.');
}

console.log('\n========================================');

// Check if signup page exists
const signupPagePath = path.join(process.cwd(), 'src', 'app', 'auth', 'signup', 'page.tsx');
if (fs.existsSync(signupPagePath)) {
  console.log('FILE: src/app/auth/signup/page.tsx');
  console.log('========================================');
  const content = fs.readFileSync(signupPagePath, 'utf8');
  console.log(content);
} else {
  console.log('WARNING: signup page NOT FOUND at src/app/auth/signup/page.tsx');
}
console.log('========================================\n');

console.log('Check complete. Please copy the output above and paste it here.');