import CartClearer from '@/components/cart/CartClearer';
import PaymentClient from './PaymentClient';

export const dynamic = 'force-dynamic';

export default async function PaymentPage({ searchParams }: { searchParams: Promise<{ orderId?: string }> }) {
  const params = await searchParams;
  const orderId = params.orderId;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <CartClearer />
      <PaymentClient orderId={orderId} />
    </div>
  );
}
