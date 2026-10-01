import fs from 'fs';
import path from 'path';

console.log('🔧 Fixing image mismatch between service and ProductCard...\n');

const productCardPath = path.join('src', 'components', 'product', 'ProductCard.tsx');

if (fs.existsSync(productCardPath)) {
  let code = fs.readFileSync(productCardPath, 'utf8');
  
  // The service returns images as: product.images = [{image_url, is_primary, display_order}, ...]
  // So we need to check product.images (not product.product_images)
  
  // Replace the entire safeImage line with the correct logic
  code = code.replace(
    /const safeImage =[\s\S]*?'';/,
    `const safeImage = 
    (product.images && product.images.find((img: any) => img.is_primary)?.image_url) ||
    (product.images && product.images[0]?.image_url) ||
    product.product_images?.find((img: any) => img.is_primary)?.image_url || 
    product.image || 
    product.image_url || 
    '';`
  );
  
  fs.writeFileSync(productCardPath, code, 'utf8');
  console.log('✅ Updated ProductCard to read from product.images (service mapping).');
} else {
  console.log('❌ ProductCard.tsx not found.');
}

console.log('\n🎉 Image mismatch fixed!');