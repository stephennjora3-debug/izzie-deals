import { Suspense } from 'react';
import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase/admin';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import CartClearer from '@/components/cart/CartClearer';

// Helper function to format date and time
function formatOrderDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('en-KE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}

async function OrderDetails({ orderId }: { orderId: string }) {
  const supabase = createAdminClient(); // Use admin client to bypass RLS for viewing order

  const { data: order, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        product_name,
        quantity,
        unit_price,
        total_price
      )
    `)
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

      {/* Order Items Table */}
      <div className="border-t border-brand-200 pt-6 mt-6">
        <h3 className="text-lg font-semibold text-brand-900 mb-4">Order Items</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-brand-700 uppercase bg-brand-50">
              <tr>
                <th className="px-4 py-3 rounded-l-lg">Product</th>
                <th className="px-4 py-3 text-center">Qty</th>
                <th className="px-4 py-3 text-right">Unit Price</th>
                <th className="px-4 py-3 text-right rounded-r-lg">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.order_items && order.order_items.map((item: any, index: number) => (
                <tr key={index} className="border-b border-brand-100 last:border-0">
                  <td className="px-4 py-3 font-medium text-brand-900">{item.product_name || 'Unknown Product'}</td>
                  <td className="px-4 py-3 text-center text-brand-700">{item.quantity}</td>
                  <td className="px-4 py-3 text-right text-brand-700">{formatCurrency(item.unit_price, 'KES')}</td>
                  <td className="px-4 py-3 text-right font-semibold text-brand-900">{formatCurrency(item.total_price, 'KES')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Summary */}
      <div className="space-y-3 border-t border-brand-200 pt-6 mt-6">
        <div className="flex justify-between text-sm">
          <span className="text-brand-600">Order Number:</span>
          <span className="font-mono font-medium">{order.id.slice(0, 8).toUpperCase()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-brand-600">Order Date:</span>
          <span className="text-brand-900">{formatOrderDateTime(order.created_at)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-brand-600">Subtotal:</span>
          <span>{formatCurrency(order.subtotal, 'KES')}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-brand-600">Shipping:</span>
          <span>{formatCurrency(order.shipping_fee, 'KES')}</span>
        </div>
        <div className="flex justify-between text-lg font-bold text-brand-900 pt-3 border-t border-brand-200">
          <span>Total:</span>
          <span>{formatCurrency(order.total, 'KES')}</span>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link href="/shop">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    </div>
  );
}

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
      {/* This component automatically clears the cart when the page loads */}
      <CartClearer />
      
      <Suspense fallback={<div className="text-center">Loading order details...</div>}>
        <OrderDetails orderId={orderId} />
      </Suspense>
    </div>
  );
}
