import fs from 'fs';
import path from 'path';

const ordersPath = path.join('src', 'app', 'admin', 'orders', 'page.tsx');

const simpleOrders = `import { createAdminClient } from '@/lib/supabase/admin';
import { formatCurrency } from '@/lib/utils';

export default async function AdminOrdersPage() {
  const supabase = createAdminClient();

  const { data: orders, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <h2 className="font-bold mb-2">Database Error</h2>
          <p>{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-brand-900 mb-8">Order Management</h1>
      
      {orders.length === 0 ? (
        <div className="text-center py-12 bg-brand-50 rounded-lg">
          <p className="text-brand-600">No orders found yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order: any) => (
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
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-brand-600 mb-1">Customer:</p>
                    <p className="font-medium text-brand-900">{order.shipping_address?.fullName || 'Guest'}</p>
                    <p className="text-brand-600">{order.shipping_address?.phone}</p>
                  </div>
                  <div>
                    <p className="text-brand-600 mb-1">Address:</p>
                    <p className="text-brand-900">{order.shipping_address?.addressLine1}</p>
                    <p className="text-brand-600">{order.shipping_address?.city}, Kenya</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-brand-100">
                <p className="text-xs text-brand-500 mb-2">Update Status:</p>
                <form action="/admin/orders/update-status" method="POST" className="inline">
                  <input type="hidden" name="orderId" value={order.id} />
                  <select 
                    name="status" 
                    defaultValue={order.status}
                    className="border border-brand-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <button 
                    type="submit"
                    className="ml-2 bg-brand-900 text-white px-3 py-1.5 rounded-md text-sm hover:bg-brand-800"
                  >
                    Update
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
`;

fs.writeFileSync(ordersPath, simpleOrders, 'utf8');
console.log('Created simpler Orders page without client components.');

// Create a simple Server Action for updating status
const actionPath = path.join('src', 'app', 'admin', 'orders', 'update-status', 'route.ts');
fs.mkdirSync(path.dirname(actionPath), { recursive: true });

const routeContent = `import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const orderId = formData.get('orderId') as string;
  const status = formData.get('status') as string;

  const supabase = createAdminClient();
  
  const { error } = await supabase
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', orderId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidatePath('/admin/orders');
  return NextResponse.redirect(new URL('/admin/orders', request.url));
}
`;

fs.writeFileSync(actionPath, routeContent, 'utf8');
console.log('Created server action route for status updates.');