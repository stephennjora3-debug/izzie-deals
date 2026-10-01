import fs from 'fs';
import path from 'path';

console.log('🔧 Applying final, bulletproof fix for Orders page...\n');

// 1. Add deleteOrder to admin.actions.ts
const actionsPath = path.join('src', 'actions', 'admin.actions.ts');
if (fs.existsSync(actionsPath)) {
  let code = fs.readFileSync(actionsPath, 'utf8');
  if (!code.includes('export async function deleteOrder')) {
    code += `\n\nexport async function deleteOrder(orderId: string) {
  const { createAdminClient } = await import('@/lib/supabase/admin');
  const { revalidatePath } = await import('next/cache');
  const supabase = createAdminClient();

  await supabase.from('order_items').delete().eq('order_id', orderId);
  const { error } = await supabase.from('orders').delete().eq('id', orderId);

  if (error) throw new Error('Failed to delete order');
  revalidatePath('/admin/orders');
  return { success: true };
}`;
    fs.writeFileSync(actionsPath, code, 'utf8');
    console.log('✅ Added deleteOrder action.');
  }
}

// 2. Create Receipt Page
const receiptDir = path.join('src', 'app', 'admin', 'orders', 'receipt');
fs.mkdirSync(receiptDir, { recursive: true });
const receiptPath = path.join(receiptDir, 'page.tsx');

const receiptCode = `import { Suspense } from 'react';
import { createAdminClient } from '@/lib/supabase/admin';
import { formatCurrency } from '@/lib/utils';
import { notFound } from 'next/navigation';
import Link from 'next/link';

async function ReceiptContent({ orderId }: { orderId: string }) {
  const supabase = createAdminClient();
  const { data: order, error } = await supabase
    .from('orders')
    .select(\`*, order_items (quantity, unit_price, total_price)\`)
    .eq('id', orderId)
    .single();

  if (error || !order) notFound();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 flex justify-between items-center no-print">
          <Link href="/admin/orders" className="text-sm text-brand-600 hover:text-brand-900">&larr; Back to Orders</Link>
          <button onClick={() => window.print()} className="bg-brand-900 text-white px-4 py-2 rounded-md text-sm hover:bg-brand-800">Print Receipt</button>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-sm border border-brand-200 print:shadow-none print:border-0">
          <div className="text-center border-b border-brand-200 pb-6 mb-6">
            <h1 className="text-3xl font-bold text-brand-900 mb-2">AURA COMMERCE</h1>
            <p className="text-brand-600 text-sm">Official Receipt</p>
          </div>
          <div className="grid grid-cols-2 gap-6 mb-6 text-sm">
            <div><p className="text-brand-600 mb-1">Receipt #</p><p className="font-mono font-bold">{order.id.slice(0, 12).toUpperCase()}</p></div>
            <div className="text-right"><p className="text-brand-600 mb-1">Date</p><p className="font-medium">{new Date(order.created_at).toLocaleDateString()}</p></div>
          </div>
          <div className="bg-brand-50 p-4 rounded-md mb-6">
            <h3 className="font-semibold text-brand-900 mb-2">Customer</h3>
            <p className="font-medium">{order.shipping_address?.fullName || 'Guest'}</p>
            <p className="text-brand-600">{order.shipping_address?.phone}</p>
          </div>
          <div className="border-t-2 border-brand-200 pt-4 flex justify-between text-lg font-bold text-brand-900">
            <span>Total Paid</span>
            <span>{formatCurrency(order.total, 'KES')}</span>
          </div>
        </div>
      </div>
      <style jsx global>{\` @media print { .no-print { display: none !important; } body { background: white; } } \`}</style>
    </div>
  );
}

export default async function ReceiptPage({ searchParams }: { searchParams: Promise<{ orderId?: string }> }) {
  const params = await searchParams;
  if (!params.orderId) notFound();
  return <Suspense fallback={<div className="p-12 text-center">Loading...</div>}><ReceiptContent orderId={params.orderId} /></Suspense>;
}
`;
fs.writeFileSync(receiptPath, receiptCode, 'utf8');
console.log('✅ Created Receipt page.');

// 3. OVERWRITE Orders Page (Fixing the double default export error)
const ordersPath = path.join('src', 'app', 'admin', 'orders', 'page.tsx');
const ordersCode = `'use client';

import { useState } from 'react';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import { deleteOrder } from '@/actions/admin.actions';

// This is the ONLY default export
export default function AdminOrdersPage({ initialOrders }: { initialOrders: any[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredOrders = orders.filter((order: any) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || 
      order.id.toLowerCase().includes(q) ||
      order.shipping_address?.fullName?.toLowerCase().includes(q) ||
      order.shipping_address?.phone?.includes(q);
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = async (orderId: string) => {
    if (!confirm('Delete this order permanently?')) return;
    try {
      await deleteOrder(orderId);
      setOrders(orders.filter((o: any) => o.id !== orderId));
    } catch (err) {
      alert('Failed to delete order');
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-brand-900 mb-8">Order Management</h1>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-brand-200 mb-6 flex gap-4">
        <input
          type="text"
          placeholder="Search Order ID, Name, or Phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 border border-brand-300 rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-brand-300 rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-12 bg-brand-50 rounded-lg"><p className="text-brand-600">No orders found.</p></div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order: any) => (
            <div key={order.id} className="bg-white rounded-lg shadow-sm border border-brand-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-brand-900">Order #{order.id.slice(0, 8).toUpperCase()}</h3>
                  <p className="text-sm text-brand-600">{new Date(order.created_at).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-brand-900">{formatCurrency(order.total, 'KES')}</p>
                  <span className={\`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize \${
                    order.status === 'paid' ? 'bg-green-100 text-green-800' :
                    order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                  }\`}>{order.status}</span>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4 text-sm mb-4">
                <div>
                  <p className="text-brand-600 mb-1">Customer:</p>
                  <p className="font-medium">{order.shipping_address?.fullName || 'Guest'}</p>
                  <p className="text-brand-600">{order.shipping_address?.phone}</p>
                </div>
                <div>
                  <p className="text-brand-600 mb-1">Address:</p>
                  <p className="text-brand-900">{order.shipping_address?.addressLine1}</p>
                  <p className="text-brand-600">{order.shipping_address?.city}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Link href={\`/admin/orders/receipt?orderId=\${order.id}\`} className="px-4 py-2 bg-brand-900 text-white rounded-md text-sm hover:bg-brand-800">
                  View Receipt
                </Link>
                <button onClick={() => handleDelete(order.id)} className="px-4 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700">
                  Delete Order
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Server-side data fetching wrapper
export async function generateMetadata() {
  return { title: 'Order Management | Admin' };
}

async function fetchData() {
  const { createAdminClient } = await import('@/lib/supabase/admin');
  const supabase = createAdminClient();
  const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
  return data || [];
}

// This is the actual entry point that Next.js uses
export async function generateStaticParams() {
  return [];
}

export default async function OrdersPageWrapper() {
  const initialOrders = await fetchData();
  return <AdminOrdersPage initialOrders={initialOrders} />;
}
`;

// Wait, I made a mistake in the draft above: TWO default exports again! 
// Let me fix the string before writing it.
const fixedOrdersCode = ordersCode.replace(
  /export default function AdminOrdersPage/,
  'function AdminOrdersPage'
);

fs.writeFileSync(ordersPath, fixedOrdersCode, 'utf8');
console.log('✅ Overwrote Orders page with correct single default export.');

console.log('\n🎉 All fixes applied successfully!');