import fs from 'fs';
import path from 'path';

const configPath = path.join(process.cwd(), 'next.config.js');

console.log('Reading next.config.js...\n');

if (fs.existsSync(configPath)) {
  const content = fs.readFileSync(configPath, 'utf8');
  console.log('=== START OF FILE ===');
  console.log(content);
  console.log('=== END OF FILE ===');
} else {
  console.log('File not found.');
}