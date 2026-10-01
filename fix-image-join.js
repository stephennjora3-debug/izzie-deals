import fs from 'fs';
import path from 'path';

console.log('🔧 Updating queries to JOIN product_images table...\n');

// 1. Update the HorizontalScrollingProducts component to fetch images
const horizontalPath = path.join('src', 'components', 'home', 'HorizontalScrollingProducts.tsx');

if (fs.existsSync(horizontalPath)) {
  let code = fs.readFileSync(horizontalPath, 'utf8');
  
  // Update the query to include product_images
  code = code.replace(
    /\.from\('products'\)\s*\.select\('\*'\)/,
    `.from('products')
        .select(\`
          *,
          product_images!inner(is_primary, image_url)
        \`)`
  );
  
  // Update the ProductCard product mapping to use the joined image
  code = code.replace(
    /image: product\.images\?\[0\] \|\| product\.image_url \|\| '',/,
    `image: product.product_images?.find(img => img.is_primary)?.image_url || '',`
  );
  
  fs.writeFileSync(horizontalPath, code, 'utf8');
  console.log('✅ Updated HorizontalScrollingProducts to fetch images.');
}

// 2. Update the Shop page to fetch images
const shopPath = path.join('src', 'app', '(shop)', 'shop', 'page.tsx');

if (fs.existsSync(shopPath)) {
  let code = fs.readFileSync(shopPath, 'utf8');
  
  // Find and update the getActiveProducts call or the products query
  if (code.includes('getActiveProducts')) {
    console.log('Shop uses service - need to update product.service.ts');
    
    // Update the product service
    const servicePath = path.join('src', 'services', 'product.service.ts');
    if (fs.existsSync(servicePath)) {
      let serviceCode = fs.readFileSync(servicePath, 'utf8');
      
      // Update the query to include product_images
      serviceCode = serviceCode.replace(
        /\.from\('products'\)\s*\.select\('[^']*'\)/,
        `.from('products')
          .select(\`
            *,
            product_images!inner(is_primary, image_url)
          \`)`
      );
      
      fs.writeFileSync(servicePath, serviceCode, 'utf8');
      console.log('✅ Updated product.service.ts to fetch images.');
    }
  }
}

// 3. Update ProductCard to handle the new image structure
const productCardPath = path.join('src', 'components', 'product', 'ProductCard.tsx');

if (fs.existsSync(productCardPath)) {
  let code = fs.readFileSync(productCardPath, 'utf8');
  
  // Update the image extraction to check product_images
  const oldImageExtract = `const safeImage = product.image || (product.images && product.images[0]) || product.image_url || '';`;
  const newImageExtract = `const safeImage = product.product_images?.find((img: any) => img.is_primary)?.image_url || product.image || (product.images && product.images[0]) || product.image_url || '';`;
  
  if (code.includes(oldImageExtract)) {
    code = code.replace(oldImageExtract, newImageExtract);
    console.log('✅ Updated ProductCard to use product_images.');
  }
  
  fs.writeFileSync(productCardPath, code, 'utf8');
}

console.log('\n🎉 Image JOIN fix applied!');