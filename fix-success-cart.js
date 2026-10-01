import fs from 'fs';
import path from 'path';

console.log('🔧 Rewriting Success page to guarantee cart clearing...\n');

// 1. Create the CartClearer Client Component
const clearerDir = path.join('src', 'components', 'cart');
fs.mkdirSync(clearerDir, { recursive: true });
const clearerPath = path.join(clearerDir, 'CartClearer.tsx');

const clearerCode = `'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';

export default function CartClearer() {
  useEffect(() => {
    const state = useCartStore.getState();
    
    // Try standard clearCart method
    if (typeof state.clearCart === 'function') {
      state.clearCart();
    } 
    // Fallback: manually reset the state if clearCart doesn't exist
    else if (typeof state.reset === 'function') {
      state.reset();
    } 
    // Ultimate fallback: force clear the items array
    else {
      useCartStore.setState({ items: [], totalItems: 0, total: 0 });
    }
    
    console.log('Cart has been cleared on success page load.');
  }, []);

  return null;
}
`;

fs.writeFileSync(clearerPath, clearerCode, 'utf8');
console.log('✅ Created CartClearer component.');

// 2. Completely rewrite the Success Page to include the clearer
const successPath = path.join('src', 'app', '(shop)', 'checkout', 'success', 'page.tsx');

const successCode = `import { Suspense } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import CartClearer from '@/components/cart/CartClearer';

async function OrderDetails({ orderId }: { orderId: string }) {
  const supabase = await createClient();

  const { data: order, error } = await supabase
    .from('orders')
    .select(\`
      *,
      order_items (
        quantity,
        unit_price,
        total_price
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
          <span className="text-brand-600">Total:</span>
          <span className="font-bold text-lg">{formatCurrency(order.total, 'KES')}</span>
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
`;

fs.writeFileSync(successPath, successCode, 'utf8');
console.log('✅ Rewrote Success page with guaranteed CartClearer.');

console.log('\n🎉 Cart clearing logic fully integrated!');