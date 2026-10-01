import fs from 'fs';
import path from 'path';

console.log(' Updating receipt to fetch REAL product data from database...\n');

const receiptPath = path.join('src', 'app', 'admin', 'orders', 'receipt', 'page.tsx');

const receiptCode = `import { Suspense } from 'react';
import { createAdminClient } from '@/lib/supabase/admin';
import { formatCurrency } from '@/lib/utils';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PrintButton } from '@/components/ui/PrintButton';

async function ReceiptContent({ orderId }: { orderId: string }) {
  const supabase = createAdminClient();
  
  // Step 1: Fetch the order and its items
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('id', orderId)
    .single();

  if (orderError || !order) {
    console.error('Error fetching order:', orderError);
    notFound();
  }

  // Step 2: Extract unique variant_ids from order items
  const variantIds = order.order_items
    .map((item: any) => item.variant_id)
    .filter(Boolean); // Remove nulls

  // Step 3: Fetch variants to get product_ids
  let variantToProductId: Record<string, string> = {};
  if (variantIds.length > 0) {
    const { data: variants } = await supabase
      .from('product_variants')
      .select('id, product_id')
      .in('id', variantIds);
    
    if (variants) {
      variants.forEach((v: any) => {
        if (v.product_id) variantToProductId[v.id] = v.product_id;
      });
    }
  }

  // Step 4: Fetch REAL product names and prices
  const productIds = Object.values(variantToProductId);
  let productMap: Record<string, any> = {};
  
  if (productIds.length > 0) {
    const { data: products } = await supabase
      .from('products')
      .select('id, name, price')
      .in('id', productIds);
    
    if (products) {
      products.forEach((p: any) => {
        productMap[p.id] = p;
      });
    }
  }

  // Step 5: Map items with REAL data
  const realItems = order.order_items.map((item: any) => {
    const productId = variantToProductId[item.variant_id];
    const realProduct = productMap[productId];
    
    return {
      ...item,
      // Use real name from products table, fallback to stored name
      displayName: realProduct?.name || item.product_name || 'Unknown Product',
      // Use real price from products table for reference, but show what was paid
      realPrice: realProduct?.price,
      paidPrice: item.unit_price
    };
  });

  const shopUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const qrCodeUrl = \`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=\${encodeURIComponent(shopUrl)}\`;

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 print:bg-white print:p-0 flex justify-center">
      <div className="w-full max-w-[380px]">
        <div className="mb-6 flex justify-between items-center print:hidden">
          <Link href="/admin/orders" className="text-sm text-brand-600 hover:text-brand-900">&larr; Back</Link>
          <PrintButton />
        </div>

        <div className="bg-white p-6 shadow-sm print:shadow-none font-mono text-xs text-gray-900 uppercase leading-tight">
          <div className="text-center mb-4">
            <h1 className="text-xl font-bold tracking-widest mb-1">AURA COMMERCE</h1>
            <p className="text-[10px] text-gray-600">Premium Multi-Category Store</p>
            <p className="text-[10px] text-gray-600">Nairobi, Kenya</p>
            <img src={qrCodeUrl} alt="Shop QR" className="mx-auto mt-3 w-20 h-20" />
          </div>

          <div className="border-b-2 border-dashed border-gray-400 my-3"></div>

          <div className="flex justify-between mb-2"><span>Receipt #:</span><span>{order.id.slice(0, 8).toUpperCase()}</span></div>
          <div className="flex justify-between mb-2"><span>Date:</span><span>{new Date(order.created_at).toLocaleDateString()}</span></div>
          <div className="flex justify-between mb-2"><span>Time:</span><span>{new Date(order.created_at).toLocaleTimeString()}</span></div>

          <div className="border-b-2 border-dashed border-gray-400 my-3"></div>

          <div className="mb-3">
            <p className="font-bold mb-1">Customer:</p>
            <p>{order.shipping_address?.fullName || 'Guest'}</p>
            <p>{order.shipping_address?.phone}</p>
            <p>{order.shipping_address?.addressLine1}</p>
          </div>

          <div className="border-b-2 border-dashed border-gray-400 my-3"></div>

          <div className="mb-3">
            <div className="flex justify-between font-bold border-b border-gray-300 pb-1 mb-2">
              <span className="w-1/2">Item</span>
              <span className="w-1/6 text-right">Qty</span>
              <span className="w-1/3 text-right">Total</span>
            </div>
            
            {realItems.map((item: any, idx: number) => (
              <div key={idx} className="flex justify-between mb-2 break-words">
                <span className="w-1/2 pr-2 normal-case capitalize">{item.displayName}</span>
                <div className="flex flex-col items-end w-1/2">
                  <span className="text-[10px] text-gray-500">{item.quantity} x {formatCurrency(item.paidPrice, 'KES')}</span>
                  <span className="font-bold">{formatCurrency(item.quantity * item.paidPrice, 'KES')}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="border-b-2 border-dashed border-gray-400 my-3"></div>

          <div className="space-y-1 mb-4">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(order.total, 'KES')}</span></div>
            <div className="flex justify-between"><span>Tax (0%)</span><span>0.00</span></div>
            <div className="flex justify-between text-sm font-bold mt-2 pt-2 border-t border-gray-300">
              <span>TOTAL</span><span>{formatCurrency(order.total, 'KES')}</span>
            </div>
          </div>

          <div className="border-b-2 border-dashed border-gray-400 my-3"></div>

          <div className="text-center mt-4 normal-case">
            <p className="font-bold mb-1">Thank you for shopping!</p>
            <p className="text-[10px] text-gray-500">Goods once sold are not returnable.</p>
            <p className="text-[10px] text-gray-500 mt-2">Status: {order.status}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function ReceiptPage({ searchParams }: { searchParams: Promise<{ orderId?: string }> }) {
  const params = await searchParams;
  if (!params.orderId) notFound();
  return (
    <Suspense fallback={<div className="p-12 text-center font-mono">Loading receipt...</div>}>
      <ReceiptContent orderId={params.orderId} />
    </Suspense>
  );
}
`;

fs.writeFileSync(receiptPath, receiptCode, 'utf8');
console.log('✅ Updated receipt to fetch REAL product names from database.');