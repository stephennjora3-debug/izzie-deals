import fs from 'fs';
import path from 'path';

console.log('Adding error handling to Admin pages...');

// 1. Fix Admin Orders Page with Try/Catch
const ordersPath = path.join('src', 'app', 'admin', 'orders', 'page.tsx');
if (fs.existsSync(ordersPath)) {
  const debugOrders = `import { createAdminClient } from '@/lib/supabase/admin';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import StatusUpdater from './StatusUpdater';

export default async function AdminOrdersPage() {
  try {
    const supabase = createAdminClient();

    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return <div className="p-8 text-red-600 bg-red-50 rounded">Database Error: {error.message}</div>;
    }

    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-brand-900 mb-8">Order Management</h1>
        {orders.length === 0 ? (
          <div className="text-center py-12 bg-brand-50 rounded-lg">
            <p className="text-brand-600">No orders found yet.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-brand-200 overflow-x-auto">
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
                    <td className="px-6 py-4 text-brand-600">{new Date(order.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-brand-900">{order.shipping_address?.fullName || 'Guest'}</div>
                      <div className="text-xs text-brand-500">{order.shipping_address?.phone}</div>
                    </td>
                    <td className="px-6 py-4 font-semibold">{formatCurrency(order.total, 'KES')}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-full text-xs font-medium capitalize bg-yellow-100 text-yellow-800">
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
        )}
      </div>
    );
  } catch (err: any) {
    return <div className="p-8 text-red-600 bg-red-50 rounded">Critical Error: {err.message}</div>;
  }
}
`;
  fs.writeFileSync(ordersPath, debugOrders, 'utf8');
  console.log('1. Updated Orders page with error catching.');
}

// 2. Fix Add Product Page with Try/Catch
const addProductPath = path.join('src', 'app', 'admin', 'add-product', 'page.tsx');
if (fs.existsSync(addProductPath)) {
  const debugAdd = `import { createAdminClient } from '@/lib/supabase/admin';
import AddProductForm from './AddProductForm';

export default async function AddProductPage() {
  try {
    const supabase = createAdminClient();

    const { data: categories, error: catError } = await supabase.from('categories').select('id, name').eq('is_active', true);
    const { data: brands, error: brandError } = await supabase.from('brands').select('id, name');

    if (catError) console.warn('Category fetch warning:', catError.message);
    if (brandError) console.warn('Brand fetch warning:', brandError.message);

    return (
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-3xl font-bold text-brand-900 mb-8">Add New Product</h1>
        <AddProductForm categories={categories || []} brands={brands || []} />
      </div>
    );
  } catch (err: any) {
    return <div className="p-8 text-red-600 bg-red-50 rounded">Critical Error: {err.message}</div>;
  }
}
`;
  fs.writeFileSync(addProductPath, debugAdd, 'utf8');
  console.log('2. Updated Add Product page with error catching.');
}

console.log('\nDebug scripts applied!');