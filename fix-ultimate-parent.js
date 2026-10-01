import fs from 'fs';
import path from 'path';

console.log('🔧 Forcing parent components to pass the real image URL...\n');

// 1. Fix HorizontalScrollingProducts (Homepage)
const horizontalPath = path.join('src', 'components', 'home', 'HorizontalScrollingProducts.tsx');
if (fs.existsSync(horizontalPath)) {
  let code = fs.readFileSync(horizontalPath, 'utf8');
  
  // Force the query to get product_images
  code = code.replace(
    /\.from\('products'\)\s*\.select\('\*'\)/,
    `.from('products').select(\`*, product_images (image_url, is_primary)\`)`
  );
  
  // Force the mapping to use the actual image URL
  code = code.replace(
    /image:\s*product\.product_images\?\.find\([^)]+\)\?\.image_url\s*\|\|\s*product\.product_images\?\[0\]\?\.image_url\s*\|\|\s*'',/g,
    `image: product.product_images?.find((img: any) => img.is_primary)?.image_url || product.product_images?.[0]?.image_url || '',`
  );
  
  // If it's still passing an empty string, replace the whole ProductCard prop block
  code = code.replace(
    /<ProductCard\s+product=\{[\s\S]*?image:\s*['"]['"][\s\S]*?\}\s*\/>/g,
    `<ProductCard 
                product={{
                  id: product.id,
                  name: product.name,
                  price: product.base_price,
                  image: product.product_images?.find((img: any) => img.is_primary)?.image_url || product.product_images?.[0]?.image_url || '',
                  category: product.category
                }}
              />`
  );
  
  fs.writeFileSync(horizontalPath, code, 'utf8');
  console.log('✅ Forced HorizontalScrollingProducts to use real image URLs.');
}

// 2. Fix the main Shop page
const shopPath = path.join('src', 'app', '(shop)', 'shop', 'page.tsx');
if (fs.existsSync(shopPath)) {
  let code = fs.readFileSync(shopPath, 'utf8');
  
  // If it's manually mapping, fix it. Otherwise, just pass the whole product object.
  if (code.includes('image: ""') || code.includes("image: ''")) {
    code = code.replace(
      /image:\s*['"]['"]/g,
      "image: product.images?.[0]?.image_url || product.product_images?.[0]?.image_url || ''"
    );
    fs.writeFileSync(shopPath, code, 'utf8');
    console.log('✅ Fixed manual image mapping in Shop page.');
  } else {
    // If it's already passing the whole product, ensure ProductCard can read it
    console.log('✅ Shop page seems to pass full product object.');
  }
}

// 3. Make ProductCard bulletproof
const productCardPath = path.join('src', 'components', 'product', 'ProductCard.tsx');
if (fs.existsSync(productCardPath)) {
  let code = fs.readFileSync(productCardPath, 'utf8');
  
  // Replace the safeImage logic with an aggressive search for ANY image URL
  const aggressiveImageLogic = `const safeImage = 
    product.image || 
    product.images?.[0]?.image_url || 
    product.product_images?.find((img: any) => img.is_primary)?.image_url || 
    product.product_images?.[0]?.image_url || 
    product.image_url || 
    '';`;
  
  code = code.replace(/const safeImage =[\s\S]*?'';/, aggressiveImageLogic);
  
  fs.writeFileSync(productCardPath, code, 'utf8');
  console.log('✅ Made ProductCard aggressively search for any image URL.');
}

console.log('\n🎉 Ultimate parent fix applied!');