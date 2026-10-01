import fs from 'fs';
import path from 'path';

const searchPath = path.join(process.cwd(), 'src', 'components', 'layout', 'SearchInput.tsx');

console.log('Reading SearchInput.tsx...\n');

if (fs.existsSync(searchPath)) {
  const content = fs.readFileSync(searchPath, 'utf8');
  console.log('=== START OF FILE ===');
  console.log(content);
  console.log('=== END OF FILE ===');
} else {
  console.log('File not found.');
}