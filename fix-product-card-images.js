import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/components/product/ProductCard.tsx');

console.log('Reading file: ' + filePath + '\n');

let content = fs.readFileSync(filePath, 'utf8');

// EXACT ANCHOR: The current flawed image extraction logic
const OLD = `  // Safely extract image
  const safeImage = 
    product.image || 
    product.images?.[0]?.image_url || 
    product.product_images?.find((img: any) => img.is_primary)?.image_url || 
    product.product_images?.[0]?.image_url || 
    product.image_url || 
    '';`;

// NEW: Correctly handle both array of strings (from service) and array of objects (from direct query)
const NEW = `  // Safely extract image
  const safeImage = 
    product.image || 
    (Array.isArray(product.images) && product.images.length > 0 ? String(product.images[0]) : product.images?.[0]?.image_url) || 
    product.product_images?.find((img: any) => img.is_primary)?.image_url || 
    product.product_images?.[0]?.image_url || 
    product.image_url || 
    '';`;

if (!content.includes(OLD)) {
  console.log("ANCHOR NOT FOUND. The file content might have changed.");
  console.log("Looking for exactly:");
  console.log(OLD);
  process.exit(1);
}

// Safe replacement
content = content.split(OLD).join(NEW);
fs.writeFileSync(filePath, content, 'utf8');

console.log('✅ SUCCESS: Updated ProductCard.tsx');
console.log('   Fixed image extraction to handle both array of strings and array of objects.');
console.log('\nThis will now correctly read the image URLs returned by product.service.ts.');