import fs from 'fs';
import path from 'path';

console.log('🔧 Applying final fixes for Cart Clearing and Receipt Names...\n');

// ==========================================
// FIX 1: Update order.actions.ts to save product_name
// ==========================================
const actionsPath = path.join('src', 'actions', 'order.actions.ts');
if (fs.existsSync(actionsPath)) {
  let code = fs.readFileSync(actionsPath, 'utf8');
  
  // Find the orderItems.push block and add product_name
  const oldPush = `orderItems.push({
      variant_id: item.variantId || null,
      quantity: item.quantity,
      unit_price: unitPrice,
      total_price: totalPrice,
    });`;

  const newPush = `orderItems.push({
      product_name: productName, // SAVE THE NAME SO RECEIPT CAN READ IT
      variant_id: item.variantId || null,
      quantity: item.quantity,
      unit_price: unitPrice,
      total_price: totalPrice,
    });`;

  if (code.includes(oldPush)) {
    code = code.replace(oldPush, newPush);
    fs.writeFileSync(actionsPath, code, 'utf8');
    console.log('✅ Updated order.actions.ts to save product_name.');
  } else {
    console.log('⚠️ Could not find exact orderItems.push block. Manual check needed.');
  }
}

// ==========================================
// FIX 2: Create CartClearer Component
// ==========================================
const clearerDir = path.join('src', 'components', 'cart');
fs.mkdirSync(clearerDir, { recursive: true });
const clearerPath = path.join(clearerDir, 'CartClearer.tsx');

const clearerCode = `'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';

export default function CartClearer() {
  useEffect(() => {
    console.log('CartClearer mounted. Clearing cart...');
    
    // 1. Clear Zustand state using the exact method from your store
    useCartStore.getState().clearCart();
    
    // 2. Nuke the specific localStorage key your store uses
    localStorage.removeItem('aura-cart-storage');
    
    console.log('Cart cleared successfully.');
  }, []);

  return null;
}
`;

fs.writeFileSync(clearerPath, clearerCode, 'utf8');
console.log('✅ Created CartClearer component.');

// ==========================================
// FIX 3: Add CartClearer to the /payment page
// ==========================================
const paymentDir = path.join('src', 'app', 'payment');
fs.mkdirSync(paymentDir, { recursive: true });
const paymentPath = path.join(paymentDir, 'page.tsx');

const paymentCode = `'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import CartClearer from '@/components/cart/CartClearer';

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    // Simulate payment processing, then redirect to success
    const timer = setTimeout(() => {
      setLoading(false);
      if (orderId) {
        // Redirect to a success page, or you can build a proper success page here
        router.push('/checkout/success?orderId=' + orderId);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [orderId, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      {/* This component clears the cart immediately when this page loads */}
      <CartClearer />
      
      <div className="text-center">
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-brand-900 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-brand-900 mb-2">Processing Order...</h2>
            <p className="text-brand-600">Please wait while we confirm your order.</p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-brand-900 mb-2">Order Confirmed!</h2>
            <p className="text-brand-600 mb-6">Redirecting to receipt...</p>
          </>
        )}
        
        <Link href="/shop" className="text-brand-600 hover:text-brand-900 underline text-sm">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
`;

fs.writeFileSync(paymentPath, paymentCode, 'utf8');
console.log('✅ Created/Updated /payment page with CartClearer.');

// ==========================================
// FIX 4: Update Receipt to read product_name directly
// ==========================================
const receiptPath = path.join('src', 'app', 'admin', 'orders', 'receipt', 'page.tsx');
if (fs.existsSync(receiptPath)) {
  let code = fs.readFileSync(receiptPath, 'utf8');
  
  // Ensure it reads item.product_name
  if (!code.includes('item.product_name')) {
    // Simple replacement to ensure it uses the saved name
    code = code.replace(
      /<span className="w-1\/2 pr-2 normal-case capitalize">\{[^}]+\}<\/span>/,
      `<span className="w-1/2 pr-2 normal-case capitalize">{item.product_name || 'Unknown Product'}</span>`
    );
    fs.writeFileSync(receiptPath, code, 'utf8');
    console.log('✅ Updated receipt to read product_name directly.');
  }
}

console.log('\n🎉 All final fixes applied!');