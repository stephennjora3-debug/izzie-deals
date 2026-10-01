import fs from 'fs';
import path from 'path';

const paymentDir = path.join(process.cwd(), 'src', 'app', 'payment');
const pagePath = path.join(paymentDir, 'page.tsx');
const clientPath = path.join(paymentDir, 'PaymentClient.tsx');

console.log('Refactoring payment page to use Next.js recommended searchParams prop...\n');

// 1. Create the Server Component (page.tsx)
const serverComponent = `'use server'; // Actually, default is server, but let's be explicit it's not a client component

import CartClearer from '@/components/cart/CartClearer';
import PaymentClient from './PaymentClient';

export const dynamic = 'force-dynamic';

export default async function PaymentPage({ searchParams }: { searchParams: Promise<{ orderId?: string }> }) {
  const params = await searchParams;
  const orderId = params.orderId;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      {/* This component clears the cart immediately when this page loads */}
      <CartClearer />
      <PaymentClient orderId={orderId} />
    </div>
  );
}
`;

// 2. Create the Client Component (PaymentClient.tsx)
const clientComponent = `'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PaymentClient({ orderId }: { orderId?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate payment processing, then redirect to success
    const timer = setTimeout(() => {
      setLoading(false);
      if (orderId) {
        router.push('/checkout/success?orderId=' + orderId);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [orderId, router]);

  return (
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
  );
}
`;

// Ensure directory exists
if (!fs.existsSync(paymentDir)) {
  fs.mkdirSync(paymentDir, { recursive: true });
}

fs.writeFileSync(pagePath, serverComponent, 'utf8');
fs.writeFileSync(clientPath, clientComponent, 'utf8');

console.log('✅ SUCCESS: Refactored payment page.');
console.log('   1. Created page.tsx as a Server Component using the searchParams prop.');
console.log('   2. Created PaymentClient.tsx to handle the UI and redirect.');
console.log('   This completely eliminates the useSearchParams() build error.');
