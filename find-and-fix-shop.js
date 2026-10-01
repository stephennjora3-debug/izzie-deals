import fs from 'fs';
import path from 'path';

console.log('🔍 Searching for ALL shop pages...\n');

// Search for all page.tsx files that might be the shop
function findShopPages(dir, results = []) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory() && file.name !== 'node_modules' && file.name !== '.next') {
      findShopPages(fullPath, results);
    } else if (file.name === 'page.tsx') {
      const content = fs.readFileSync(fullPath, 'utf8');
      // Look for files that contain "Shop" or product-related code
      if (content.includes('Shop All Products') || content.includes('ProductCard') || content.includes('base_price') || content.includes('product.base_price')) {
        results.push(fullPath);
      }
    }
  }
  return results;
}

const shopPages = findShopPages('src');

console.log('Found shop pages:');
shopPages.forEach((p, i) => {
  console.log(`${i + 1}. ${p}`);
});

if (shopPages.length === 0) {
  console.log('\n❌ No shop pages found. Let me search more broadly...');
  
  // Search for any file containing "Categories" and "Price Range" (from your screenshot)
  function findSidebarShop(dir, results = []) {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    for (const file of files) {
      const fullPath = path.join(dir, file.name);
      if (file.isDirectory() && file.name !== 'node_modules' && file.name !== '.next') {
        findSidebarShop(fullPath, results);
      } else if (file.name === 'page.tsx') {
        const content = fs.readFileSync(fullPath, 'utf8');
        if (content.includes('Categories') && content.includes('Price Range')) {
          results.push(fullPath);
        }
      }
    }
    return results;
  }
  
  const sidebarShops = findSidebarShop('src');
  console.log('\nFound pages with Categories + Price Range sidebar:');
  sidebarShops.forEach((p, i) => {
    console.log(`${i + 1}. ${p}`);
  });
}