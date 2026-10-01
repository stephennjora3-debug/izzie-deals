import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/app/(shop)/product/[slug]/page.tsx');

if (fs.existsSync(filePath)) {
  const content = fs.readFileSync(filePath, 'utf8');
  console.log('FILE: src/app/(shop)/product/[slug]/page.tsx');
  console.log('========================================');
  console.log(content);
  console.log('========================================');
} else {
  console.log('File not found. Checking alternative path...');
  const altPath = path.join(process.cwd(), 'src/app/product/[slug]/page.tsx');
  if (fs.existsSync(altPath)) {
    const content = fs.readFileSync(altPath, 'utf8');
    console.log('FILE: src/app/product/[slug]/page.tsx');
    console.log('========================================');
    console.log(content);
    console.log('========================================');
  } else {
    console.log('Product detail page not found.');
  }
}