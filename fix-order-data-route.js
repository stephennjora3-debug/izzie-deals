import fs from 'fs';
import path from 'path';

console.log(' Creating data fix API route...\n');

const apiDir = path.join('src', 'app', 'api', 'fix-order-names');
fs.mkdirSync(apiDir, { recursive: true });

const routeCode = `import { createAdminClient } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = createAdminClient();

  // 1. Find all order items where product_name is null
  const { data: items, error } = await supabase
    .from('order_items')
    .select('id, unit_price')
    .is('product_name', null);

  if (error) {
    return NextResponse.json({ error: error.message });
  }

  if (!items || items.length === 0) {
    return NextResponse.json({ message: 'No items need fixing.' });
  }

  let updatedCount = 0;

  // 2. Update them based on price (Heuristic for your current test data)
  for (const item of items) {
    let name = 'Unknown Product';
    
    // Match prices to your known products
    if (item.unit_price === 15000) name = 'Cesello Black Genuine shoe';
    else if (item.unit_price === 2500) name = 'Premium Cotton T-Shirt';
    else if (item.unit_price === 3500) name = 'Wireless Headphones';
    else if (item.unit_price === 17700) name = 'Bundle Deal'; // Example

    await supabase
      .from('order_items')
      .update({ product_name: name })
      .eq('id', item.id);
    
    updatedCount++;
  }

  return NextResponse.json({ 
    success: true, 
    message: \`Fixed \${updatedCount} items. Refresh your receipt now.\` 
  });
}
`;

fs.writeFileSync(path.join(apiDir, 'route.ts'), routeCode, 'utf8');
console.log('✅ Created /api/fix-order-names route.');