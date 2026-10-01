import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/components/home/HorizontalScrollingProducts.tsx');

console.log('Reading file: ' + filePath + '\n');

let content = fs.readFileSync(filePath, 'utf8');

// EXACT ANCHOR: The line currently mapping the image incorrectly
const OLD = `                  image: product.images?.[0] || product.image_url || '',`;

// NEW: Map directly from the product_images array fetched by the query
const NEW = `                  image: product.product_images?.[0]?.image_url || '',`;

if (!content.includes(OLD)) {
  console.log("ANCHOR NOT FOUND. The file content might have changed.");
  console.log("Looking for exactly:");
  console.log(OLD);
  process.exit(1);
}

// Safe replacement
content = content.split(OLD).join(NEW);
fs.writeFileSync(filePath, content, 'utf8');

console.log('✅ SUCCESS: Updated HorizontalScrollingProducts.tsx');
console.log('   Changed: image: product.images?.[0] || product.image_url || \'\'');
console.log('   To:      image: product.product_images?.[0]?.image_url || \'\'');
console.log('\nThis will now pass the actual Cloudinary/Unsplash URL to the ProductCard.');