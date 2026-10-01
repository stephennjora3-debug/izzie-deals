import fs from 'fs';
import path from 'path';

console.log('🔍 Checking for product_images table in Supabase...\n');

const routeDir = path.join('src', 'app', 'api', 'check-images');
fs.mkdirSync(routeDir, { recursive: true });

const routeCode = `import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();
  
  // Try to fetch from product_images table
  const { data: images, error: imagesError } = await supabase
    .from('product_images')
    .select('*')
    .limit(5);
  
  // Also check the products table for any image-related columns
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id, name, image, image_url, images')
    .limit(3);
  
  return Response.json({
    productImages: images,
    productImagesError: imagesError?.message || null,
    products: products,
    productsError: productsError?.message || null
  });
}
`;

fs.writeFileSync(path.join(routeDir, 'route.ts'), routeCode, 'utf8');

console.log('✅ Created diagnostic endpoint at: http://localhost:3000/api/check-images');
console.log('\n Next steps:');
console.log('1. Make sure your server is running (npm run dev)');
console.log('2. Visit: http://localhost:3000/api/check-images');
console.log('3. Copy the JSON output and paste it here');
console.log('\nThis will tell us exactly where your images should be stored!');