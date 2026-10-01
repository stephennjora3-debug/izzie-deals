import fs from 'fs';
import path from 'path';

console.log(' Creating database diagnostic endpoint...\n');

// Create debug directory
const debugDir = path.join('src', 'app', 'debug');
fs.mkdirSync(debugDir, { recursive: true });

const debugCode = `import { createAdminClient } from '@/lib/supabase/admin';

export async function GET() {
  const supabase = createAdminClient();
  
  // 1. Get a sample order
  const { data: order } = await supabase
    .from('orders')
    .select('*')
    .limit(1)
    .single();
  
  if (!order) {
    return Response.json({ error: 'No orders found' });
  }
  
  // 2. Get order items with ALL columns
  const { data: items, error: itemsError } = await supabase
    .from('order_items')
    .select('*')
    .eq('order_id', order.id);
  
  // 3. Get all products
  const { data: products } = await supabase
    .from('products')
    .select('id, name');
  
  return Response.json({
    orderId: order.id,
    orderItems: items,
    orderItemsError: itemsError,
    availableProducts: products,
    schema: {
      orderItemColumns: items?.[0] ? Object.keys(items[0]) : [],
      productColumns: products?.[0] ? Object.keys(products[0]) : []
    }
  });
}
`;

fs.writeFileSync(path.join(debugDir, 'route.ts'), debugCode, 'utf8');
console.log('✅ Created diagnostic endpoint');
console.log('\\n📋 Next steps:');
console.log('1. Run: npm run dev');
console.log('2. Visit: http://localhost:3000/debug');
console.log('3. Copy the JSON output and paste it here');
console.log('\\nThis will show us exactly what columns exist in order_items and what product_id values are stored.');