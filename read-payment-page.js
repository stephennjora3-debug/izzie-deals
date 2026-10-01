import fs from 'fs';
import path from 'path';

const paymentPath = path.join(process.cwd(), 'src', 'app', 'payment', 'page.tsx');
const altPaymentPath = path.join(process.cwd(), 'src', 'app', '(shop)', 'payment', 'page.tsx');

console.log('Reading payment page...\n');

let targetPath = fs.existsSync(paymentPath) ? paymentPath : altPaymentPath;

if (fs.existsSync(targetPath)) {
  const content = fs.readFileSync(targetPath, 'utf8');
  console.log('FILE: ' + targetPath);
  console.log('========================================');
  console.log(content);
  console.log('========================================');
} else {
  console.log('ERROR: Could not find payment page in either location.');
}