import fs from 'fs';
import path from 'path';

const shopPath = path.join(process.cwd(), 'src/app/(shop)/shop/page.tsx');

if (fs.existsSync(shopPath)) {
  const content = fs.readFileSync(shopPath, 'utf8');
  console.log('FILE: src/app/(shop)/shop/page.tsx');
  console.log('========================================');
  console.log(content);
} else {
  console.log('File not found. Checking alternative paths...');
  
  const altPath = path.join(process.cwd(), 'src/app/shop/page.tsx');
  if (fs.existsSync(altPath)) {
    const content = fs.readFileSync(altPath, 'utf8');
    console.log('FILE: src/app/shop/page.tsx');
    console.log('========================================');
    console.log(content);
  } else {
    console.log('Shop page not found in either location.');
  }
}