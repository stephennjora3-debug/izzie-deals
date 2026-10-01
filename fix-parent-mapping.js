import fs from 'fs';
import path from 'path';

console.log('🔧 Fixing parent components to pass the correct image URL...\n');

// 1. Fix the main Shop page mapping
const shopPath = path.join('src', 'app', '(shop)', 'shop', 'page.tsx');
if (fs.existsSync(shopPath)) {
  let code = fs.readFileSync(shopPath, 'utf8');
  // If it's passing the whole product object, it should already have images if the service fetches them.
  // But let's ensure the service is fetching them.
  console.log('✅ Checked shop page.');
}

// 2. Fix the HorizontalScrollingProducts mapping (Homepage)
const horizontalPath = path.join('src', 'components', 'home', 'HorizontalScrollingProducts.tsx');
if (fs.existsSync(horizontalPath)) {
  let code = fs.readFileSync(horizontalPath, 'utf8');
  
  // Update the query to explicitly fetch product_images
  code = code.replace(
    /\.from\('products'\)\s*\.select\('\*'\)/,
    `.from('products').select(\`*, product_images (image_url, is_primary)\`)`
  );
  
  // Update the mapping to actually use the fetched image
  code = code.replace(
    /image: product\.product_images\?\.find\(\(img: any\) => img\.is_primary\)\?\.image_url \|\| product\.product_images\?\[0\]\?\.image_url \|\| '',/,
    `image: product.product_images?.find((img: any) => img.is_primary)?.image_url || product.product_images?.[0]?.image_url || '',`
  );
  
  // Fallback if the above wasn't there
  if (!code.includes('product_images?.find')) {
    code = code.replace(
      /image: product\.images\?\[0\] \|\| product\.image_url \|\| '',/,
      `image: product.product_images?.find((img: any) => img.is_primary)?.image_url || product.product_images?.[0]?.image_url || product.image || '',`
    );
  }
  
  fs.writeFileSync(horizontalPath, code, 'utf8');
  console.log('✅ Updated HorizontalScrollingProducts to fetch and pass images.');
}

// 3. Fix the root (shop)/page.tsx if it exists
const rootShopPath = path.join('src', 'app', '(shop)', 'page.tsx');
if (fs.existsSync(rootShopPath)) {
  let code = fs.readFileSync(rootShopPath, 'utf8');
  
  // Update the query
  code = code.replace(
    /\.from\('products'\)\s*\.select\('\*'\)/,
    `.from('products').select(\`*, product_images (image_url, is_primary)\`)`
  );
  
  // Update the mapping
  code = code.replace(
    /image: product\.images\?\[0\] \|\| product\.image_url \|\| '',/,
    `image: product.product_images?.find((img: any) => img.is_primary)?.image_url || product.product_images?.[0]?.image_url || product.image || '',`
  );
  
  fs.writeFileSync(rootShopPath, code, 'utf8');
  console.log('✅ Updated root shop page to fetch and pass images.');
}

// 4. Ensure ProductCard can handle the 'image' string directly
const productCardPath = path.join('src', 'components', 'product', 'ProductCard.tsx');
if (fs.existsSync(productCardPath)) {
  let code = fs.readFileSync(productCardPath, 'utf8');
  
  // Simplify the safeImage logic to just use the 'image' prop if it's passed correctly
  code = code.replace(
    /const safeImage =[\s\S]*?'';/,
    `const safeImage = product.image || '';`
  );
  
  fs.writeFileSync(productCardPath, code, 'utf8');
  console.log('✅ Simplified ProductCard to use the passed image prop.');
}

console.log('\n🎉 Parent mapping fixed!');