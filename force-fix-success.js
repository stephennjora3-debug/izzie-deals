import fs from 'fs';
import path from 'path';

const successPath = path.join('src', 'app', '(shop)', 'checkout', 'success', 'page.tsx');

// Ensure directory exists
fs.mkdirSync(path.dirname(successPath), { recursive: true });

const successContent = `import { Suspense } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

async function OrderDetails({ orderId }: { orderId: string }) {
  const supabase = await createClient();

  const { data: order, error } = await supabase
    .from('orders')
    .select(\`
      *,
      order_items (
        quantity,
        unit_price,
        total_price,
        product_variants (
          product_id,
          attributes
        )
      )
    \`)
    .eq('id', orderId)
    .single();

  if (error || !order) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Could not find order details.</p>
        <Link href="/shop">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-brand-200">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
        </div>
        <h1 className="text-2xl font-bold text-brand-900 mb-2">Order Confirmed!</h1>
        <p className="text-brand-600">Thank you for your purchase.</p>
      </div>

      <div className="space-y-4 border-t border-brand-100 pt-6">
        <div className="flex justify-between text-sm">
          <span className="text-brand-600">Order Number:</span>
          <span className="font-mono font-medium">{order.id.slice(0, 8).toUpperCase()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-brand-600">Date:</span>
          <span>{new Date(order.created_at).toLocaleDateString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-brand-600">Status:</span>
          <span className="capitalize font-medium text-green-600">{order.status}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-brand-600">Total:</span>
          <span className="font-bold text-lg">{formatCurrency(order.total, 'KES')}</span>
        </div>

        {order.order_items && order.order_items.length > 0 && (
          <div className="border-t border-brand-100 pt-4 mt-4">
            <h3 className="text-sm font-semibold text-brand-900 mb-3">Items Purchased</h3>
            <div className="space-y-2">
              {order.order_items.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between text-sm">
                  <div>
                    <span className="font-medium text-brand-900">Product</span>
                    <span className="text-brand-600 ml-2">x {item.quantity}</span>
                  </div>
                  <span className="font-medium text-brand-900">{formatCurrency(item.total_price, 'KES')}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 text-center">
        <Link href="/shop">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    </div>
  );
}

// Next.js 15 way: searchParams is a Promise
export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ orderId?: string }> }) {
  const params = await searchParams;
  const orderId = params.orderId;

  if (!orderId) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-red-600 mb-4">No order ID provided.</p>
        <Link href="/shop">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <Suspense fallback={
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-brand-200 text-center">
          <p className="text-brand-600 animate-pulse">Loading order details...</p>
        </div>
      }>
        <OrderDetails orderId={orderId} />
      </Suspense>
    </div>
  );
}
`;

fs.writeFileSync(successPath, successContent, 'utf8');
console.log('✅ Force rewrote success/page.tsx. No useSearchParams hook used.');