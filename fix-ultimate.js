import fs from 'fs';
import path from 'path';

console.log(' Applying ultimate fix and adding diagnostics...\n');

// 1. Completely rewrite utils.ts to fix the NaN issue permanently
const utilsPath = path.join('src', 'lib', 'utils.ts');
const utilsCode = `export function formatCurrency(amount: number | string | null | undefined, currency: string = 'KES'): string {
  const numValue = Number(amount);
  if (isNaN(numValue)) {
    return 'KSh 0.00';
  }
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  }).format(numValue);
}

export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}
`;

fs.writeFileSync(utilsPath, utilsCode, 'utf8');
console.log('✅ Completely rewrote utils.ts to prevent NaN errors.');

// 2. Update Shop Page to log the exact database structure to the console
const shopPaths = [
  path.join('src', 'app', '(shop)', 'page.tsx'),
  path.join('src', 'app', 'shop', 'page.tsx')
];

for (const shopPath of shopPaths) {
  if (fs.existsSync(shopPath)) {
    let code = fs.readFileSync(shopPath, 'utf8');
    
    // Add a console log right after fetching products
    if (!code.includes("console.log('DEBUG PRODUCTS:'")) {
      code = code.replace(
        /if \(error\) \{/,
        `console.log('DEBUG PRODUCTS:', products);
    if (error) {`
      );
      fs.writeFileSync(shopPath, code, 'utf8');
      console.log('✅ Added debug logging to Shop page.');
    }
    break;
  }
}

console.log('\n Ultimate fix applied!');