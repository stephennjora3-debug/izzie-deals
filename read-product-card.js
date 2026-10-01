import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/components/product/ProductCard.tsx');

if (fs.existsSync(filePath)) {
  const content = fs.readFileSync(filePath, 'utf8');
  console.log('FILE: src/components/product/ProductCard.tsx');
  console.log('========================================');
  console.log(content);
  console.log('========================================');
} else {
  console.log('File not found.');
}