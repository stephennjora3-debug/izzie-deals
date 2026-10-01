import { createAdminClient } from '@/lib/supabase/admin';

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
