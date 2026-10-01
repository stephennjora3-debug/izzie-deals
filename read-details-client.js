import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/components/product/ProductDetailsClient.tsx');

if (fs.existsSync(filePath)) {
  const content = fs.readFileSync(filePath, 'utf8');
  console.log('FILE: src/components/product/ProductDetailsClient.tsx');
  console.log('========================================');
  console.log(content);
  console.log('========================================');
} else {
  console.log('File not found. Checking alternative paths...');
  
  const altPath1 = path.join(process.cwd(), 'src/app/(shop)/product/[slug]/ProductDetailsClient.tsx');
  if (fs.existsSync(altPath1)) {
    const content = fs.readFileSync(altPath1, 'utf8');
    console.log('FILE: src/app/(shop)/product/[slug]/ProductDetailsClient.tsx');
    console.log('========================================');
    console.log(content);
    console.log('========================================');
  } else {
    console.log('ProductDetailsClient.tsx not found in expected locations.');
  }
}