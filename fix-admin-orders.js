import fs from 'fs';
import path from 'path';

console.log('Adding search, delete, and receipt features to Orders page...');

// 1. Create Admin Actions for delete and receipt
const actionsPath = path.join('src', 'actions', 'admin.actions.ts');
let actionsCode = fs.readFileSync(actionsPath, 'utf8');

// Add delete order function
if (!actionsCode.includes('export async function deleteOrder')) {
  actionsCode = actionsCode.replace(
    "export type OrderStatus = 'pending'",
    `export type OrderStatus = 'pending'

export async function deleteOrder(orderId: string) {
  const supabase = createAdminClient();

  // First delete order items
  await supabase.from('order_items').delete().eq('order_id', orderId);
  
  // Then delete the order
  const { error } = await supabase.from('orders').delete().eq('id', orderId);

  if (error) {
    console.error('Error deleting order:', error);
    throw new Error('Failed to delete order');
  }

  revalidatePath('/admin/orders');
  return { success: true };
}

export async function generateReceipt(orderId: string) {
  const supabase = createAdminClient();

  const { data: order, error } = await supabase
    .from('orders')
    .select(\`
      *,
      order_items (
        quantity,
        unit_price,
        total_price,
        product_variants (
          product_id,
          attributes
        )
      )
    \`)
    .eq('id', orderId)
    .single();

  if (error || !order) {
    throw new Error('Order not found');
  }

  return order;
}`
  );
  
  fs.writeFileSync(actionsPath, actionsCode, 'utf8');
  console.log('1. Added delete and receipt actions.');
}

// 2. Create Receipt Component
const receiptPath = path.join('src', 'app', 'admin', 'orders', 'receipt', 'page.tsx');
fs.mkdirSync(path.dirname(receiptPath), { recursive: true });

const receiptContent = `import { Suspense } from 'react';
import { createAdminClient } from '@/lib/supabase/admin';
import { formatCurrency } from '@/lib/utils';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/Button';

async function ReceiptContent({ orderId }: { orderId: string }) {
  const supabase = createAdminClient();

  const { data: order, error } = await supabase
    .from('orders')
    .select(\`
      *,
      order_items (
        quantity,
        unit_price,
        total_price
      )
    \`)
    .eq('id', orderId)
    .single();

  if (error || !order) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Print Button */}
        <div className="mb-6 flex justify-between items-center no-print">
          <a href="/admin/orders" className="text-sm text-brand-600 hover:text-brand-900">
            &larr; Back to Orders
          </a>
          <Button onClick={() => window.print()} size="sm">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print Receipt
          </Button>
        </div>

        {/* Receipt */}
        <div className="bg-white p-8 rounded-lg shadow-sm border border-brand-200 print:shadow-none print:border-0">
          {/* Header */}
          <div className="text-center border-b border-brand-200 pb-6 mb-6">
            <h1 className="text-3xl font-bold text-brand-900 mb-2">AURA COMMERCE</h1>
            <p className="text-brand-600 text-sm">Premium Multi-Category Store</p>
            <p className="text-brand-600 text-sm">Nairobi, Kenya</p>
          </div>

          {/* Receipt Info */}
          <div className="grid grid-cols-2 gap-6 mb-6 text-sm">
            <div>
              <p className="text-brand-600 mb-1">Receipt #</p>
              <p className="font-mono font-bold text-brand-900">{order.id.slice(0, 12).toUpperCase()}</p>
            </div>
            <div className="text-right">
              <p className="text-brand-600 mb-1">Date</p>
              <p className="font-medium text-brand-900">{new Date(order.created_at).toLocaleDateString()}</p>
              <p className="text-brand-600">{new Date(order.created_at).toLocaleTimeString()}</p>
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-brand-50 p-4 rounded-md mb-6">
            <h3 className="font-semibold text-brand-900 mb-2">Customer Details</h3>
            <p className="text-brand-900 font-medium">{order.shipping_address?.fullName}</p>
            <p className="text-brand-600">{order.shipping_address?.phone}</p>
            <p className="text-brand-600">{order.shipping_address?.email}</p>
          </div>

          {/* Items Table */}
          <div className="mb-6">
            <table className="w-full text-sm">
              <thead className="bg-brand-50 border-b border-brand-200">
                <tr>
                  <th className="text-left py-3 px-2 font-semibold text-brand-900">Item</th>
                  <th className="text-center py-3 px-2 font-semibold text-brand-900">Qty</th>
                  <th className="text-right py-3 px-2 font-semibold text-brand-900">Price</th>
                  <th className="text-right py-3 px-2 font-semibold text-brand-900">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.order_items?.map((item: any, idx: number) => (
                  <tr key={idx} className="border-b border-brand-100">
                    <td className="py-3 px-2 text-brand-900">Product #{item.product_variants?.product_id?.slice(0, 8).toUpperCase() || 'Unknown'}</td>
                    <td className="py-3 px-2 text-center text-brand-600">{item.quantity}</td>
                    <td className="py-3 px-2 text-right text-brand-600">{formatCurrency(item.unit_price, 'KES')}</td>
                    <td className="py-3 px-2 text-right font-medium text-brand-900">{formatCurrency(item.total_price, 'KES')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="border-t-2 border-brand-200 pt-4">
            <div className="flex justify-between mb-2 text-sm">
              <span className="text-brand-600">Subtotal</span>
              <span className="font-medium text-brand-900">{formatCurrency(order.total, 'KES')}</span>
            </div>
            <div className="flex justify-between mb-4 text-sm">
              <span className="text-brand-600">Shipping</span>
              <span className="font-medium text-brand-900">Free</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-brand-900">
              <span>Total</span>
              <span>{formatCurrency(order.total, 'KES')}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-brand-200 text-center text-sm text-brand-600">
            <p className="mb-2">Thank you for shopping with us!</p>
            <p>For inquiries, contact: support@auracommerce.co.ke</p>
            <p className="mt-4 text-xs">Status: <span className="capitalize font-medium text-brand-900">{order.status}</span></p>
          </div>
        </div>

        {/* Share Buttons */}
        <div className="mt-6 flex gap-3 no-print">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              const text = \`Receipt #${order.id.slice(0, 8).toUpperCase()} - Total: ${formatCurrency(order.total, 'KES')}\`;
              navigator.clipboard.writeText(text);
              alert('Receipt link copied to clipboard!');
            }}
          >
            Copy Link
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              const shareData = {
                title: 'Order Receipt - Aura Commerce',
                text: \`Your order receipt from Aura Commerce\`,
                url: window.location.href
              };
              if (navigator.share) {
                navigator.share(shareData);
              } else {
                alert('Sharing not supported on this device');
              }
            }}
          >
            Share
          </Button>
        </div>
      </div>

      <style jsx global>{\`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            background: white;
          }
        }
      \`}</style>
    </div>
  );
}

export default async function ReceiptPage({ searchParams }: { searchParams: Promise<{ orderId?: string }> }) {
  const params = await searchParams;
  const orderId = params.orderId;

  if (!orderId) {
    notFound();
  }

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading receipt...</div>}>
      <ReceiptContent orderId={orderId} />
    </Suspense>
  );
}
`;

fs.writeFileSync(receiptPath, receiptContent, 'utf8');
console.log('2. Created Receipt page component.');

// 3. Update Orders Page with search, delete, and receipt buttons
const ordersPath = path.join('src', 'app', 'admin', 'orders', 'page.tsx');
const ordersContent = `'use client';

import { useState, useMemo } from 'react';
import { createAdminClient } from '@/lib/supabase/server';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import { deleteOrder } from '@/actions/admin.actions';

export default function AdminOrdersPage({ initialOrders }: { initialOrders: any[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Filter orders based on search and status
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch = searchQuery === '' || 
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.shipping_address?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.shipping_address?.phone?.includes(searchQuery);
      
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  const handleDelete = async (orderId: string) => {
    if (!confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteOrder(orderId);
      setOrders(orders.filter(o => o.id !== orderId));
      alert('Order deleted successfully');
    } catch (error) {
      alert('Failed to delete order: ' + error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-brand-900">Order Management</h1>
        <Link href="/admin/add-product" className="text-sm text-brand-600 hover:text-brand-900 underline">
          &larr; Back to Add Product
        </Link>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-brand-200 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by Order ID, Customer Name, or Phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-brand-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-brand-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
        <div className="mt-2 text-sm text-brand-600">
          Showing {filteredOrders.length} of {orders.length} orders
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-12 bg-brand-50 rounded-lg">
          <p className="text-brand-600">No orders found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order: any) => (
            <div key={order.id} className="bg-white rounded-lg shadow-sm border border-brand-200 p-6">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="font-bold text-brand-900">Order #{order.id.slice(0, 8).toUpperCase()}</h3>
                  <p className="text-sm text-brand-600">{new Date(order.created_at).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-brand-900">{formatCurrency(order.total, 'KES')}</p>
                  <span className={\`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize \${
                    order.status === 'paid' ? 'bg-green-100 text-green-800' :
                    order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'delivered' ? 'bg-purple-100 text-purple-800' :
                    order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }\`}>
                    {order.status}
                  </span>
                </div>
              </div>
              
              <div className="border-t border-brand-100 pt-4">
                <div className="grid md:grid-cols-2 gap-4 text-sm mb-4">
                  <div>
                    <p className="text-brand-600 mb-1">Customer:</p>
                    <p className="font-medium text-brand-900">{order.shipping_address?.fullName || 'Guest'}</p>
                    <p className="text-brand-600">{order.shipping_address?.phone}</p>
                    {order.shipping_address?.email && (
                      <p className="text-brand-600">{order.shipping_address.email}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-brand-600 mb-1">Address:</p>
                    <p className="text-brand-900">{order.shipping_address?.addressLine1}</p>
                    <p className="text-brand-600">{order.shipping_address?.city}, Kenya</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-brand-100">
                <Link
                  href={\`/admin/orders/receipt?orderId=\${order.id}\`}
                  className="inline-flex items-center px-3 py-1.5 bg-brand-900 text-white rounded-md text-sm hover:bg-brand-800 transition-colors"
                >
                  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Receipt
                </Link>
                <select
                  value={order.status}
                  onChange={async (e) => {
                    // You can add status update logic here
                    alert('Status update feature coming soon');
                  }}
                  className="border border-brand-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <button
                  onClick={() => handleDelete(order.id)}
                  className="inline-flex items-center px-3 py-1.5 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 transition-colors"
                >
                  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Server component to fetch initial data
export async function generateMetadata() {
  return {
    title: 'Order Management | Aura Commerce Admin'
  };
}

async function fetchData() {
  const supabase = createAdminClient();
  const { data: orders, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching orders:', error);
    return [];
  }

  return orders || [];
}

// Wrap in a server component
export default async function OrdersPageWrapper() {
  const initialOrders = await fetchData();
  return <AdminOrdersPage initialOrders={initialOrders} />;
}
`;

fs.writeFileSync(ordersPath, ordersContent, 'utf8');
console.log('3. Updated Orders page with search, filter, delete, and receipt features.');

console.log('\n✅ All admin order features added successfully!');