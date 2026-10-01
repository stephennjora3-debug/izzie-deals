import fs from 'fs';
import path from 'path';

console.log('🔧 Adding functional Status Dropdown to Orders page...\n');

// 1. Ensure updateOrderStatus exists in admin.actions.ts
const actionsPath = path.join('src', 'actions', 'admin.actions.ts');
if (fs.existsSync(actionsPath)) {
  let code = fs.readFileSync(actionsPath, 'utf8');
  if (!code.includes('export async function updateOrderStatus')) {
    code += `\n\nexport async function updateOrderStatus(orderId: string, status: string) {
  const { createAdminClient } = await import('@/lib/supabase/admin');
  const { revalidatePath } = await import('next/cache');
  const supabase = createAdminClient();
  const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);
  if (error) throw new Error('Failed to update status');
  revalidatePath('/admin/orders');
  return { success: true };
}`;
    fs.writeFileSync(actionsPath, code, 'utf8');
    console.log('✅ Added updateOrderStatus action.');
  }
}

// 2. Completely rewrite OrdersList.tsx to include the dropdown
const listPath = path.join('src', 'app', 'admin', 'orders', 'OrdersList.tsx');
const listCode = `'use client';

import { useState } from 'react';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import { deleteOrder, updateOrderStatus } from '@/actions/admin.actions';

export default function OrdersList({ initialOrders }: { initialOrders: any[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

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

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
      // Update local state immediately for a snappy feel
      setOrders(orders.map((o: any) => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      alert('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-brand-900 mb-8">Order Management</h1>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-brand-200 mb-6 flex flex-col md:flex-row gap-4">
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
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-4">
                <div>
                  <h3 className="font-bold text-brand-900">Order #{order.id.slice(0, 8).toUpperCase()}</h3>
                  <p className="text-sm text-brand-600">{new Date(order.created_at).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-xl font-bold text-brand-900">{formatCurrency(order.total, 'KES')}</p>
                  
                  {/* Functional Status Dropdown */}
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    disabled={updatingId === order.id}
                    className={\`px-3 py-1 rounded-full text-xs font-medium capitalize border-0 focus:ring-2 focus:ring-brand-500 outline-none cursor-pointer disabled:opacity-50 \${
                      order.status === 'paid' ? 'bg-green-100 text-green-800' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'delivered' ? 'bg-purple-100 text-purple-800' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                    }\`}
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
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
`;

fs.writeFileSync(listPath, listCode, 'utf8');
console.log('✅ Rewrote OrdersList.tsx with functional Status Dropdown.');

console.log('\n🎉 Status dropdown added successfully!');