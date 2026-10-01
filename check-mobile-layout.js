import fs from 'fs';
import path from 'path';

const filesToCheck = [
  'src/components/layout/Header.tsx',
  'src/components/layout/Footer.tsx',
  'src/app/(shop)/page.tsx',
  'src/components/product/ProductCard.tsx'
];

console.log('Checking current layout components for mobile responsiveness...\n');

filesToCheck.forEach(filePath => {
  const fullPath = path.join(process.cwd(), filePath);
  console.log('========================================');
  console.log('FILE: ' + filePath);
  console.log('========================================');
  
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, 'utf8');
    // Show first 1500 characters to see the structure and Tailwind classes
    console.log(content.substring(0, 1500) + '\n...(truncated)');
  } else {
    console.log('WARNING: FILE NOT FOUND');
  }
  console.log('\n');
});

console.log('Check complete. Please copy the output above and paste it here.');