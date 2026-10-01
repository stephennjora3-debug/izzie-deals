import fs from 'fs';
import path from 'path';

console.log(' Diagnosing product image storage...\n');

// Create a debug API route
const debugDir = path.join('src', 'app', 'debug-products');
fs.mkdirSync(debugDir, { recursive: true });

const routeCode = `import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();
  
  // Fetch products with ALL columns to see what's available
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .limit(3);
  
  if (error) {
    return Response.json({ error: error.message });
  }
  
  // Show the structure of the first product
  return Response.json({
    count: products?.length || 0,
    sampleProducts: products,
    availableColumns: products?.[0] ? Object.keys(products[0]) : []
  });
}
`;

fs.writeFileSync(path.join(debugDir, 'route.ts'), routeCode, 'utf8');

console.log('✅ Created debug endpoint at: http://localhost:3000/debug-products');
console.log('\n📋 Next steps:');
console.log('1. Make sure your server is running (npm run dev)');
console.log('2. Visit: http://localhost:3000/debug-products');
console.log('3. Copy the JSON output and paste it here');
console.log('\nThis will show us exactly which column stores the images!');