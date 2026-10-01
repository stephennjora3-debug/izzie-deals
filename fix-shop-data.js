import fs from 'fs';
import path from 'path';

console.log(' Fixing shop data mapping...\n');

// Fix the Shop page to handle different field names
const shopPath = path.join('src', 'app', '(shop)', 'page.tsx');

if (fs.existsSync(shopPath)) {
  let code = fs.readFileSync(shopPath, 'utf8');
  
  // Update the product mapping to try multiple field names
  code = code.replace(
    /product={{[\s\S]*?id: product\.id,[\s\S]*?name: product\.name,[\s\S]*?price: product\.base_price,[\s\S]*?image: product\.images\?\[0\] \|\| product\.image_url \|\| product\.image \|\| '',[\s\S]*?category: product\.category[\s\S]*?}}/,
    `product={{
                id: product.id,
                name: product.name,
                price: product.base_price || product.price || 0,
                image: product.images?.[0] || product.image_url || product.image || product.thumbnail || '',
                category: product.category || 'General'
              }}`
  );
  
  // Fix the grid to be 5 columns
  code = code.replace(
    /grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5/,
    'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'
  );
  
  fs.writeFileSync(shopPath, code, 'utf8');
  console.log('✅ Fixed price and image mapping, updated grid to 5 columns.');
} else {
  console.log('⚠️ Shop page not found.');
}

// Also fix the formatCurrency to handle NaN
const utilsPath = path.join('src', 'lib', 'utils.ts');
if (fs.existsSync(utilsPath)) {
  let code = fs.readFileSync(utilsPath, 'utf8');
  
  // Add null check to formatCurrency
  if (!code.includes('|| 0')) {
    code = code.replace(
      /formatCurrency\(value: number/g,
      'formatCurrency(value: number | null | undefined'
    );
    code = code.replace(
      /return new Intl\.NumberFormat/,
      'const numValue = value || 0;\n  return new Intl.NumberFormat'
    );
    code = code.replace(
      /'KES'\)/g,
      "'KES', { minimumFractionDigits: 2 })"
    );
    fs.writeFileSync(utilsPath, code, 'utf8');
    console.log('✅ Fixed formatCurrency to handle null/undefined values.');
  }
}

console.log('\n🎉 Shop data mapping fixed!');