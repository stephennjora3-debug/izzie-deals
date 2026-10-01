import fs from 'fs';
import path from 'path';

console.log(' Creating debug version to see actual product data...\n');

const productCardPath = path.join('src', 'components', 'product', 'ProductCard.tsx');

if (fs.existsSync(productCardPath)) {
  let code = fs.readFileSync(productCardPath, 'utf8');
  
  // Add a console.log right at the start of the component to show the entire product object
  if (!code.includes("console.log('PRODUCT DEBUG:'")) {
    code = code.replace(
      /export function ProductCard\(\{ product \}: ProductCardProps\) \{/,
      `export function ProductCard({ product }: ProductCardProps) {
  console.log('PRODUCT DEBUG:', JSON.stringify(product, null, 2));`
    );
    fs.writeFileSync(productCardPath, code, 'utf8');
    console.log('✅ Added debug logging to ProductCard.');
  }
}

console.log('\n🎯 Next steps:');
console.log('1. Run: npm run dev');
console.log('2. Go to http://localhost:3000/shop');
console.log('3. Press F12 to open Developer Tools');
console.log('4. Click the Console tab');
console.log('5. Look for "PRODUCT DEBUG:" messages');
console.log('6. Copy the JSON output and paste it here');
console.log('\nThis will show us EXACTLY what data structure we\'re working with!');
