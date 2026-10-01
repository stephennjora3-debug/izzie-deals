import { createAdminClient } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = createAdminClient();

  // Paul's order ID from the URL
  const orderId = '22c40707-646e-4bf5-a5c7-66d32489cb87';

  // Update ALL items in this order to show "Cesello Black Genuine shoe"
  const { data, error } = await supabase
    .from('order_items')
    .update({ product_name: 'Cesello Black Genuine shoe' })
    .eq('order_id', orderId);

  if (error) {
    return NextResponse.json({ error: error.message });
  }

  return NextResponse.json({ 
    success: true, 
    message: `Updated all items in Paul's order to show "Cesello Black Genuine shoe"` 
  });
}
