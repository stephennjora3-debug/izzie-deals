import fs from 'fs';
import path from 'path';

console.log('🔧 Splitting Orders page into Server and Client components...\n');

// 1. Create the Server Component (page.tsx)
const pagePath = path.join('src', 'app', 'admin', 'orders', 'page.tsx');
const pageCode = `import { createAdminClient } from '@/lib/supabase/admin';
import OrdersList from './OrdersList';

export const metadata = {
  title: 'Order Management | Admin',
};

async function fetchData() {
  const supabase = createAdminClient();
  const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
  return data || [];
}

export default async function AdminOrdersPage() {
  const initialOrders = await fetchData();
  return <OrdersList initialOrders={initialOrders} />;
}
`;
fs.writeFileSync(pagePath, pageCode, 'utf8');
console.log('✅ Created Server Component (page.tsx)');

// 2. Create the Client Component (OrdersList.tsx)
const listPath = path.join('src', 'app', 'admin', 'orders', 'OrdersList.tsx');
const listCode = `'use client';

import { useState } from 'react';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import { deleteOrder } from '@/actions/admin.actions';

export default function OrdersList({ initialOrders }: { initialOrders: any[] }) {
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
                <div className="text-left md:text-right">
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
`;
fs.writeFileSync(listPath, listCode, 'utf8');
console.log('✅ Created Client Component (OrdersList.tsx)');

console.log('\n🎉 Files split correctly! No more "use client" conflicts.');