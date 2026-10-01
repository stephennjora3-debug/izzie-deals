import { createClient } from '@/lib/supabase/server';

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
