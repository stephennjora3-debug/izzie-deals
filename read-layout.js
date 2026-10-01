import fs from 'fs';
import path from 'path';

const layoutPath = path.join(process.cwd(), 'src', 'app', 'layout.tsx');

console.log('Reading layout.tsx...\n');

if (fs.existsSync(layoutPath)) {
  const content = fs.readFileSync(layoutPath, 'utf8');
  console.log('=== START OF FILE ===');
  console.log(content);
  console.log('=== END OF FILE ===');
} else {
  console.log('File not found.');
}