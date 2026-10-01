import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src', 'components', 'layout', 'Header.tsx');

console.log('Reading file: ' + filePath + '\n');

if (fs.existsSync(filePath)) {
  const content = fs.readFileSync(filePath, 'utf8');
  console.log('FILE: src/components/layout/Header.tsx');
  console.log('========================================');
  console.log(content);
  console.log('========================================');
} else {
  console.log('WARNING: FILE NOT FOUND at ' + filePath);
}

console.log('\nPlease copy the output above and paste it here.');