import fs from 'fs';
import path from 'path';

const headerPath = path.join(process.cwd(), 'src', 'components', 'layout', 'Header.tsx');

console.log('Reading full Header.tsx...\n');

if (fs.existsSync(headerPath)) {
  const content = fs.readFileSync(headerPath, 'utf8');
  console.log('=== START OF FILE ===');
  console.log(content);
  console.log('=== END OF FILE ===');
} else {
  console.log('File not found.');
}