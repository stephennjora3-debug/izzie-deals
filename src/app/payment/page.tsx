'use client';

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
