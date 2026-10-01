import fs from 'fs';
import path from 'path';

console.log(' Creating comprehensive database fix...\n');

const apiDir = path.join('src', 'app', 'api', 'fix-all-order-names');
fs.mkdirSync(apiDir, { recursive: true });

const routeCode = `import { createAdminClient } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = createAdminClient();

  // 1. Find all items with missing names
  const { data: items, error } = await supabase
    .from('order_items')
    .select('id, unit_price')
    .is('product_name', null);

  if (error) return NextResponse.json({ error: error.message });
  if (!items || items.length === 0) return NextResponse.json({ message: 'All names are already set.' });

  let fixedCount = 0;

  // 2. Fix them based on price (since the variant link is broken)
  for (const item of items) {
    let name = 'Unknown Product';
    
    // Match your exact store prices
    if (item.unit_price === 15000) name = 'Cesello Black Genuine shoe';
    else if (item.unit_price === 2500) name = 'Premium Cotton T-Shirt';
    else if (item.unit_price === 3500) name = 'Wireless Headphones';
    else if (item.unit_price === 17700) name = 'Bundle Deal';

    await supabase
      .from('order_items')
      .update({ product_name: name })
      .eq('id', item.id);
      
    fixedCount++;
  }

  return NextResponse.json({ 
    success: true, 
    message: \`Fixed \${fixedCount} order items. Refresh your receipts now.\` 
  });
}
`;

fs.writeFileSync(path.join(apiDir, 'route.ts'), routeCode, 'utf8');
console.log('✅ Created /api/fix-all-order-names route.');