import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/components/home/HorizontalScrollingProducts.tsx');

console.log('Reading file: ' + filePath + '\n');

let content = fs.readFileSync(filePath, 'utf8');

// EXACT ANCHOR: The ProductCard mapping in HorizontalScrollingProducts
const OLD = `                <ProductCard 
                  product={{
                    id: product.id,
                    name: product.name,
                    price: product.base_price,
                    image: product.product_images?.[0]?.image_url || '',
                    category: product.category
                  }}
                />`;

const NEW = `                <ProductCard 
                  product={{
                    id: product.id,
                    name: product.name,
                    slug: product.slug,
                    price: product.base_price,
                    image: product.product_images?.[0]?.image_url || '',
                    category: product.category
                  }}
                />`;

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
console.log('   Added "slug: product.slug" to the ProductCard props.');
console.log('\nThis will ensure links go to /product/[slug] instead of /product/[id].');