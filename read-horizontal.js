import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/components/home/HorizontalScrollingProducts.tsx');

if (fs.existsSync(filePath)) {
  const content = fs.readFileSync(filePath, 'utf8');
  console.log('FILE: src/components/home/HorizontalScrollingProducts.tsx');
  console.log('========================================');
  console.log(content);
  console.log('========================================');
} else {
  console.log('File not found.');
}