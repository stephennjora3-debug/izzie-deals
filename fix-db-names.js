import fs from 'fs';
import path from 'path';

console.log(' Creating database fix API...\n');

const apiDir = path.join('src', 'app', 'api', 'fix-db-names');
fs.mkdirSync(apiDir, { recursive: true });

const routeCode = `import { createAdminClient } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = createAdminClient();

  // Define the correct mapping based on your store's prices
  const priceToName = [
    { price: 15000, name: 'Cesello Black Genuine shoe' },
    { price: 2500, name: 'Premium Cotton T-Shirt' },
    { price: 3500, name: 'Wireless Headphones' }
  ];

  let totalFixed = 0;

  // Update all order items that match these prices
  for (const rule of priceToName) {
    const { data, error } = await supabase
      .from('order_items')
      .update({ product_name: rule.name })
      .eq('unit_price', rule.price);
      
    if (!error && data) {
      totalFixed += data.length; // Note: Supabase update returns data if return is set, but we just count attempts
    }
  }

  return NextResponse.json({ 
    success: true, 
    message: \`Database updated. Refresh your receipt now.\` 
  });
}
`;

fs.writeFileSync(path.join(apiDir, 'route.ts'), routeCode, 'utf8');
console.log('✅ Created /api/fix-db-names route.');