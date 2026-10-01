import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src', 'app', 'shipping', 'page.tsx');

console.log('Checking shipping page...\n');

if (fs.existsSync(filePath)) {
  const content = fs.readFileSync(filePath, 'utf8');
  console.log('FILE: src/app/shipping/page.tsx');
  console.log('========================================');
  console.log(content);
  console.log('========================================');
} else {
  console.log('WARNING: src/app/shipping/page.tsx NOT FOUND.');
  console.log('We may need to create a basic shipping information page.');
}