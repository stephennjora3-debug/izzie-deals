import fs from 'fs';
import path from 'path';

const filePath = path.join('src', 'app', 'layout.tsx');

if (!fs.existsSync(filePath)) {
  console.log('layout.tsx not found');
  process.exit(1);
}

console.log('Current layout.tsx content:');
console.log(fs.readFileSync(filePath, 'utf8'));