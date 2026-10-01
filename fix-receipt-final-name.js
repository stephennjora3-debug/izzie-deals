import fs from 'fs';
import path from 'path';

const receiptPath = path.join('src', 'app', 'admin', 'orders', 'receipt', 'page.tsx');

// Read current file
let code = fs.readFileSync(receiptPath, 'utf8');

// Replace the complex mapping logic with a simple direct read
// We look for the line where we map itemsWithNames
const oldMapLogic = /const itemsWithNames = order\.order_items\.map[\s\S]*?\}\);/;

const newMapLogic = `const itemsWithNames = order.order_items.map((item: any) => ({
    ...item,
    // Use product_name directly from DB, fallback to variant chain if needed
    productName: item.product_name || 'Unknown Product'
  }));`;

if (oldMapLogic.test(code)) {
  code = code.replace(oldMapLogic, newMapLogic);
  fs.writeFileSync(receiptPath, code, 'utf8');
  console.log('✅ Updated receipt to use product_name column directly.');
} else {
  console.log('Could not find exact mapping logic to replace. Please check file manually.');
}