import fs from 'fs';
import path from 'path';

const checkoutPath = path.join(process.cwd(), 'src', 'app', '(shop)', 'checkout', 'page.tsx');

console.log('Reading EXACT checkout page content...\n');

if (fs.existsSync(checkoutPath)) {
  const content = fs.readFileSync(checkoutPath, 'utf8');
  console.log('=== START OF FILE ===');
  console.log(content);
  console.log('=== END OF FILE ===');
} else {
  console.log('File not found at: ' + checkoutPath);
  
  // Try alternative path
  const altPath = path.join(process.cwd(), 'src', 'app', 'checkout', 'page.tsx');
  if (fs.existsSync(altPath)) {
    console.log('\nFound at alternative path: ' + altPath);
    const content = fs.readFileSync(altPath, 'utf8');
    console.log('=== START OF FILE ===');
    console.log(content);
    console.log('=== END OF FILE ===');
  }
}