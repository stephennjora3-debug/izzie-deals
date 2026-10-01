import fs from 'fs';
import path from 'path';

console.log('🔧 Fixing the Supabase query to include product_images...\n');

const horizontalPath = path.join('src', 'components', 'home', 'HorizontalScrollingProducts.tsx');

if (fs.existsSync(horizontalPath)) {
  let code = fs.readFileSync(horizontalPath, 'utf8');
  
  // 1. Update the Supabase query to fetch images
  const oldQuery = `.from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);`;
  
  const newQuery = `.from('products')
        .select(\`
          *,
          product_images (
            image_url,
            is_primary
          )
        \`)
        .order('created_at', { ascending: false })
        .limit(20);`;
  
  if (code.includes(oldQuery)) {
    code = code.replace(oldQuery, newQuery);
    console.log('✅ Updated Supabase query to fetch product_images.');
  } else {
    console.log('⚠️ Could not find exact query. Trying regex...');
    code = code.replace(
      /\.from\('products'\)\s*\.select\('\*'\)/,
      `.from('products').select(\`*, product_images (image_url, is_primary)\`)`
    );
  }
  
  // 2. Update the ProductCard mapping to use the correct image path
  // The data will now be in product.product_images[0].image_url
  code = code.replace(
    /image: product\.product_images\?\.find\(img => img\.is_primary\)\?\.image_url \|\| '',/,
    `image: product.product_images?.find((img: any) => img.is_primary)?.image_url || product.product_images?.[0]?.image_url || '',`
  );
  
  fs.writeFileSync(horizontalPath, code, 'utf8');
  console.log('✅ Updated image mapping in HorizontalScrollingProducts.');
} else {
  console.log('❌ HorizontalScrollingProducts.tsx not found.');
}

console.log('\n Query fixed!');