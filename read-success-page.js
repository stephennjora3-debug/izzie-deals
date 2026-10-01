import fs from 'fs';
import path from 'path';

const successPath = path.join(process.cwd(), 'src', 'app', '(shop)', 'checkout', 'success', 'page.tsx');

console.log('Reading success page...\n');

if (fs.existsSync(successPath)) {
  const content = fs.readFileSync(successPath, 'utf8');
  console.log('FILE: src/app/(shop)/checkout/success/page.tsx');
  console.log('========================================');
  console.log(content);
  console.log('========================================');
} else {
  console.log('File not found. Checking alternative paths...');
  
  const altPath1 = path.join(process.cwd(), 'src', 'app', 'checkout', 'success', 'page.tsx');
  if (fs.existsSync(altPath1)) {
    const content = fs.readFileSync(altPath1, 'utf8');
    console.log('FILE: src/app/checkout/success/page.tsx');
    console.log('========================================');
    console.log(content);
    console.log('========================================');
  } else {
    console.log('Success page not found in expected locations.');
  }
}