import fs from 'fs';
import path from 'path';

console.log('🔧 Fixing Receipt page onClick error...\n');

// 1. Create a Client Component for the Print Button
const printButtonDir = path.join('src', 'components', 'ui');
fs.mkdirSync(printButtonDir, { recursive: true });
const printButtonPath = path.join(printButtonDir, 'PrintButton.tsx');

const printButtonCode = `'use client';

export function PrintButton() {
  return (
    <button 
      onClick={() => window.print()} 
      className="bg-brand-900 text-white px-4 py-2 rounded-md text-sm hover:bg-brand-800 transition-colors"
    >
      Print Receipt
    </button>
  );
}
`;

fs.writeFileSync(printButtonPath, printButtonCode, 'utf8');
console.log('✅ Created PrintButton Client Component.');

// 2. Update the Receipt Page to use the new PrintButton
const receiptPath = path.join('src', 'app', 'admin', 'orders', 'receipt', 'page.tsx');

const receiptCode = `import { Suspense } from 'react';
import { createAdminClient } from '@/lib/supabase/admin';
import { formatCurrency } from '@/lib/utils';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PrintButton } from '@/components/ui/PrintButton';

async function ReceiptContent({ orderId }: { orderId: string }) {
  const supabase = createAdminClient();
  const { data: order, error } = await supabase
    .from('orders')
    .select(\`*, order_items (quantity, unit_price, total_price)\`)
    .eq('id', orderId)
    .single();

  if (error || !order) notFound();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 print:bg-white print:p-0">
      <div className="max-w-3xl mx-auto">
        {/* This div hides when printing */}
        <div className="mb-6 flex justify-between items-center print:hidden">
          <Link href="/admin/orders" className="text-sm text-brand-600 hover:text-brand-900">&larr; Back to Orders</Link>
          <PrintButton />
        </div>
        
        {/* Receipt Card */}
        <div className="bg-white p-8 rounded-lg shadow-sm border border-brand-200 print:shadow-none print:border-0 print:p-0">
          <div className="text-center border-b border-brand-200 pb-6 mb-6 print:border-black">
            <h1 className="text-3xl font-bold text-brand-900 mb-2">AURA COMMERCE</h1>
            <p className="text-brand-600 text-sm">Official Receipt</p>
          </div>
          
          <div className="grid grid-cols-2 gap-6 mb-6 text-sm">
            <div>
              <p className="text-brand-600 mb-1">Receipt #</p>
              <p className="font-mono font-bold">{order.id.slice(0, 12).toUpperCase()}</p>
            </div>
            <div className="text-right">
              <p className="text-brand-600 mb-1">Date</p>
              <p className="font-medium">{new Date(order.created_at).toLocaleDateString()}</p>
            </div>
          </div>
          
          <div className="bg-brand-50 p-4 rounded-md mb-6 print:bg-gray-100">
            <h3 className="font-semibold text-brand-900 mb-2">Customer</h3>
            <p className="font-medium">{order.shipping_address?.fullName || 'Guest'}</p>
            <p className="text-brand-600">{order.shipping_address?.phone}</p>
          </div>
          
          <div className="border-t-2 border-brand-200 pt-4 flex justify-between text-lg font-bold text-brand-900 print:border-black">
            <span>Total Paid</span>
            <span>{formatCurrency(order.total, 'KES')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function ReceiptPage({ searchParams }: { searchParams: Promise<{ orderId?: string }> }) {
  const params = await searchParams;
  if (!params.orderId) notFound();
  return <Suspense fallback={<div className="p-12 text-center">Loading receipt...</div>}><ReceiptContent orderId={params.orderId} /></Suspense>;
}
`;

fs.writeFileSync(receiptPath, receiptCode, 'utf8');
console.log('✅ Updated Receipt page to use the new PrintButton.');

console.log('\n🎉 Receipt page onClick error fixed!');