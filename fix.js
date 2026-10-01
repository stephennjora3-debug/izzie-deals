import fs from 'fs';
import path from 'path';

console.log('Building Admin Order Dashboard...');

// 1. Create Admin Actions for updating status
const actionsDir = path.join('src', 'actions');
const adminActionPath = path.join(actionsDir, 'admin.actions.ts');

const adminActionContent = `'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', orderId);

  if (error) {
    console.error('Error updating order status:', error);
    throw new Error('Failed to update order status');
  }

  revalidatePath('/admin/orders');
  return { success: true };
}
`;

fs.mkdirSync(actionsDir, { recursive: true });
fs.writeFileSync(adminActionPath, adminActionContent, 'utf8');
console.log('1. Created admin.actions.ts');

// 2. Create the Admin Orders Page
const ordersDir = path.join('src', 'app', 'admin', 'orders');
const ordersPagePath = path.join(ordersDir, 'page.tsx');

const ordersPageContent = `import { createAdminClient } from '@/lib/supabase/admin';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import StatusUpdater from './StatusUpdater';

export default async function AdminOrdersPage() {
  const supabase = createAdminClient();

  const { data: orders, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return <div className="p-8 text-red-600">Error loading orders: {error.message}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-brand-900">Order Management</h1>
        <Link href="/admin/add-product" className="text-sm text-brand-600 hover:text-brand-900 underline">
          &larr; Back to Add Product
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12 bg-brand-50 rounded-lg">
          <p className="text-brand-600">No orders found yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-brand-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-brand-50 text-brand-700 uppercase text-xs">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-100">
                {orders.map((order: any) => (
                  <tr key={order.id} className="hover:bg-brand-50/50">
                    <td className="px-6 py-4 font-mono text-xs">{order.id.slice(0, 8).toUpperCase()}</td>
                    <td className="px-6 py-4 text-brand-600">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-brand-900">{order.shipping_address?.fullName || 'Guest'}</div>
                      <div className="text-xs text-brand-500">{order.shipping_address?.phone}</div>
                    </td>
                    <td className="px-6 py-4 font-semibold">{formatCurrency(order.total, 'KES')}</td>
                    <td className="px-6 py-4">
                      <span className={\`px-2 py-1 rounded-full text-xs font-medium capitalize \${
                        order.status === 'paid' ? 'bg-green-100 text-green-800' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'delivered' ? 'bg-purple-100 text-purple-800' :
                        order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }\`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusUpdater orderId={order.id} currentStatus={order.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
`;

fs.mkdirSync(ordersDir, { recursive: true });
fs.writeFileSync(ordersPagePath, ordersPageContent, 'utf8');
console.log('2. Created admin/orders/page.tsx');

// 3. Create the Status Updater Client Component
const statusUpdaterPath = path.join(ordersDir, 'StatusUpdater.tsx');

const statusUpdaterContent = `'use client';

import { useState } from 'react';
import { updateOrderStatus, OrderStatus } from '@/actions/admin.actions';

const statuses: OrderStatus[] = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];

export default function StatusUpdater({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as OrderStatus;
    setLoading(true);
    try {
      await updateOrderStatus(orderId, newStatus);
      setStatus(newStatus);
    } catch (err) {
      alert('Failed to update status');
      setStatus(currentStatus); // Revert on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <select
      value={status}
      onChange={handleChange}
      disabled={loading}
      className="border border-brand-300 rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:opacity-50"
    >
      {statuses.map((s) => (
        <option key={s} value={s} className="capitalize">{s}</option>
      ))}
    </select>
  );
}
`;

fs.writeFileSync(statusUpdaterPath, statusUpdaterContent, 'utf8');
console.log('3. Created StatusUpdater component');

// 4. Add "Orders" link to Header
const headerPath = path.join('src', 'components', 'layout', 'Header.tsx');
if (fs.existsSync(headerPath)) {
  let c = fs.readFileSync(headerPath, 'utf8');
  
  // Add Link import if missing (should be there)
  if (!c.includes("import Link from 'next/link';")) {
     c = "import Link from 'next/link';\n" + c;
  }

  // Insert Orders link before Add Product
  if (!c.includes('href="/admin/orders"')) {
    c = c.replace(
      '<Link href="/admin/add-product"',
      '<Link href="/admin/orders" className="hidden md:flex items-center gap-2 px-3 py-2 text-sm font-medium text-brand-700 hover:text-brand-900 hover:bg-brand-100 rounded-md transition-colors">Orders</Link>\n            <Link href="/admin/add-product"'
    );
    console.log('4. Added Orders link to Header');
  }
  fs.writeFileSync(headerPath, c, 'utf8');
}

console.log('\nAdmin Dashboard built successfully!');