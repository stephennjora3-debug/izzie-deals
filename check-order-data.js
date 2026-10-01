import fs from 'fs';
import path from 'path';

console.log(' Checking what data is actually in the order...\n');

// Create a temporary API route to debug this
const debugDir = path.join('src', 'app', 'debug-order');
fs.mkdirSync(debugDir, { recursive: true });

const debugCode = `import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get('orderId');
  
  if (!orderId) {
    return Response.json({ error: 'No orderId provided' });
  }

  const supabase = createAdminClient();
  
  // Fetch order
  const { data: order } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single();
  
  // Fetch order items
  const { data: items } = await supabase
    .from('order_items')
    .select('*')
    .eq('order_id', orderId);
  
  // Fetch all products
  const { data: products } = await supabase
    .from('products')
    .select('id, name');
  
  return Response.json({
    order,
    items,
    products,
    itemProductIds: items?.map(i => i.product_id)
  });
}
`;

fs.writeFileSync(path.join(debugDir, 'route.ts'), debugCode, 'utf8');
console.log('✅ Created debug endpoint at /debug-order?orderId=YOUR_ORDER_ID');
console.log('\\n📋 To use it:');
console.log('1. Copy an order ID from your orders page');
console.log('2. Visit: http://localhost:3000/debug-order?orderId=YOUR_ORDER_ID');
console.log('3. Check what product_id values are stored in the order_items');