import fs from 'fs';
import path from 'path';

const successPath = path.join(process.cwd(), 'src', 'app', '(shop)', 'checkout', 'success', 'page.tsx');

console.log('Reading current success page...\n');

if (fs.existsSync(successPath)) {
  const content = fs.readFileSync(successPath, 'utf8');
  console.log('=== START OF FILE ===');
  console.log(content);
  console.log('=== END OF FILE ===');
} else {
  console.log('File not found.');
}