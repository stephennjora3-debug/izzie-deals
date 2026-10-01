import fs from 'fs';
import path from 'path';

console.log('🔧 Fixing price mapping and grid in both shop pages...\n');

const shopPaths = [
  path.join('src', 'app', '(shop)', 'page.tsx'),
  path.join('src', 'app', '(shop)', 'shop', 'page.tsx')
];

for (const shopPath of shopPaths) {
  if (fs.existsSync(shopPath)) {
    let code = fs.readFileSync(shopPath, 'utf8');
    
    // 1. Fix the price mapping: change product.price to product.base_price
    // This handles variations like "price: product.price" or "price: product.price || 0"
    code = code.replace(/price:\s*product\.price/g, 'price: product.base_price');
    code = code.replace(/price:\s*product\.price\s*\|\|\s*0/g, 'price: product.base_price || 0');
    
    // 2. Fix the image mapping to handle empty images gracefully
    code = code.replace(/image:\s*product\.image/g, "image: product.images?.[0] || product.image_url || ''");
    
    // 3. Force the grid to be 5 columns on large screens
    code = code.replace(/grid-cols-1\s+sm:grid-cols-2\s+lg:grid-cols-3/g, 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5');
    code = code.replace(/grid-cols-1\s+md:grid-cols-2\s+lg:grid-cols-3/g, 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5');
    code = code.replace(/grid-cols-1\s+sm:grid-cols-2\s+md:grid-cols-3\s+lg:grid-cols-4/g, 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5');
    
    fs.writeFileSync(shopPath, code, 'utf8');
    console.log('✅ Fixed:', shopPath);
  } else {
    console.log('⚠️ Not found:', shopPath);
  }
}

console.log('\n🎉 Both shop pages updated!');