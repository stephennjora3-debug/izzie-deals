'use server'; // Actually, default is server, but let's be explicit it's not a client component

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
