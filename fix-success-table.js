import fs from 'fs';
import path from 'path';

const successPath = path.join(process.cwd(), 'src', 'app', '(shop)', 'checkout', 'success', 'page.tsx');

console.log('Updating success page to show product names and use a compact table...\n');

let content = fs.readFileSync(successPath, 'utf8');

// ANCHOR 1: Add product_name to the select query
const OLD_SELECT = `  const { data: order, error } = await supabase
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
    .single();`;

const NEW_SELECT = `  const { data: order, error } = await supabase
    .from('orders')
    .select(\`
      *,
      order_items (
        product_name,
        quantity,
        unit_price,
        total_price
      )
    \`)
    .eq('id', orderId)
    .single();`;

if (!content.includes(OLD_SELECT)) {
  console.log("ANCHOR 1 NOT FOUND (Select query)");
  process.exit(1);
}
content = content.split(OLD_SELECT).join(NEW_SELECT);

// ANCHOR 2: Replace the Order Items section with a compact table
const OLD_ITEMS_DIV = `      {/* Order Items */}
      <div className="border-t border-brand-200 pt-6 mt-6">
        <h3 className="text-lg font-semibold text-brand-900 mb-4">Order Items</h3>
        <div className="space-y-3">
          {order.order_items && order.order_items.map((item: any, index: number) => (
            <div key={index} className="flex justify-between items-center py-3 border-b border-brand-100 last:border-0">
              <div className="flex-1">
                <p className="font-medium text-brand-900">{item.product_name || 'Product'}</p>
                <p className="text-sm text-brand-600">Qty: {item.quantity} × {formatCurrency(item.unit_price, 'KES')}</p>
              </div>
              <p className="font-semibold text-brand-900">{formatCurrency(item.total_price, 'KES')}</p>
            </div>
          ))}
        </div>
      </div>`;

const NEW_ITEMS_TABLE = `      {/* Order Items Table */}
      <div className="border-t border-brand-200 pt-6 mt-6">
        <h3 className="text-lg font-semibold text-brand-900 mb-4">Order Items</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-brand-700 uppercase bg-brand-50">
              <tr>
                <th className="px-4 py-3 rounded-l-lg">Product</th>
                <th className="px-4 py-3 text-center">Qty</th>
                <th className="px-4 py-3 text-right">Unit Price</th>
                <th className="px-4 py-3 text-right rounded-r-lg">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.order_items && order.order_items.map((item: any, index: number) => (
                <tr key={index} className="border-b border-brand-100 last:border-0">
                  <td className="px-4 py-3 font-medium text-brand-900">{item.product_name || 'Unknown Product'}</td>
                  <td className="px-4 py-3 text-center text-brand-700">{item.quantity}</td>
                  <td className="px-4 py-3 text-right text-brand-700">{formatCurrency(item.unit_price, 'KES')}</td>
                  <td className="px-4 py-3 text-right font-semibold text-brand-900">{formatCurrency(item.total_price, 'KES')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>`;

if (!content.includes(OLD_ITEMS_DIV)) {
  console.log("ANCHOR 2 NOT FOUND (Order Items section)");
  process.exit(1);
}
content = content.split(OLD_ITEMS_DIV).join(NEW_ITEMS_TABLE);

fs.writeFileSync(successPath, content, 'utf8');

console.log('✅ SUCCESS: Updated success page');
console.log('   1. Added "product_name" to the database query so it fetches the real name.');
console.log('   2. Converted the items list into a compact, professional invoice table.');
console.log('\nRefresh the success page to see the updated table with product names!');