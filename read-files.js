import fs from 'fs';
import path from 'path';

// Automatically use the folder you are currently in
const projectRoot = process.cwd();

const filesToRead = [
  'src/components/product/ProductCard.tsx',
  'src/components/home/HorizontalScrollingProducts.tsx',
  'src/services/product.service.ts'
];

console.log('Reading current file states from: ' + projectRoot + '\n');

filesToRead.forEach(filePath => {
  const fullPath = path.join(projectRoot, filePath);
  console.log('========================================');
  console.log('FILE: ' + filePath);
  console.log('========================================');
  
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, 'utf8');
    console.log(content);
  } else {
    console.log('WARNING: FILE NOT FOUND at ' + fullPath);
  }
  
  console.log('\n========================================\n');
});

console.log('Read complete. Please copy the output above and paste it here.');