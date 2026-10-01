import { createAdminClient } from '@/lib/supabase/admin';

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
