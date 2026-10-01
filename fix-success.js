import fs from 'fs';
import path from 'path';

const filePath = path.join('src', 'app', '(shop)', 'checkout', 'success', 'page.tsx');

const newSuccessPage = `import { createAdminClient } from '@/lib/supabase/admin';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { CheckCircle, ArrowRight } from 'lucide-react';

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const { orderId } = await searchParams;

  if (!orderId) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-red-600 mb-4">No order ID provided</p>
        <Link href="/shop">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  const supabase = createAdminClient();
  const { data: order } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single();

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-red-600 mb-4">Order not found</p>
        <Link href="/shop">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        <CheckCircle className="mx-auto h-20 w-20 text-green-600 mb-6" />
        
        <h1 className="text-4xl font-bold text-brand-900 mb-4">
          Order Confirmed!
        </h1>
        
        <p className="text-lg text-brand-600 mb-8">
          Thank you for your order. We've received your purchase and will process it shortly.
        </p>

        <div className="bg-brand-50 rounded-lg p-8 mb-8 text-left">
          <h2 className="text-xl font-semibold text-brand-900 mb-4">Order Details</h2>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-brand-600">Order Number:</span>
              <span className="font-mono font-medium">{order.id.slice(0, 8).toUpperCase()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-600">Order Date:</span>
              <span>{new Date(order.created_at).toLocaleDateString('en-KE', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-600">Status:</span>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium capitalize">
                {order.status}
              </span>
            </div>
            <div className="border-t border-brand-200 pt-3 mt-4">
              <div className="flex justify-between text-lg font-bold text-brand-900">
                <span>Total Amount:</span>
                <span>{formatCurrency(order.total, 'KES')}</span>
              </div>
            </div>
          </div>
        </div>

        {order.shipping_address && (
          <div className="bg-brand-50 rounded-lg p-6 mb-8 text-left">
            <h3 className="font-semibold text-brand-900 mb-3">Shipping Address</h3>
            <p className="text-brand-700">{order.shipping_address.fullName}</p>
            <p className="text-brand-700">{order.shipping_address.addressLine1}</p>
            <p className="text-brand-700">{order.shipping_address.city}, Kenya</p>
            <p className="text-brand-700">{order.shipping_address.phone}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/shop">
            <Button variant="outline" size="lg">
              Continue Shopping
            </Button>
          </Link>
          <Link href="/shop">
            <Button size="lg">
              Track Order
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
`;

fs.writeFileSync(filePath, newSuccessPage, 'utf8');
console.log('Success page converted to Server Component.');