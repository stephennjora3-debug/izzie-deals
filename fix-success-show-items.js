import fs from 'fs';
import path from 'path';

const successPath = path.join(process.cwd(), 'src', 'app', '(shop)', 'checkout', 'success', 'page.tsx');

console.log('Enhancing success page to show order items...\n');

let content = fs.readFileSync(successPath, 'utf8');

// ANCHOR: Replace the basic order details section with full items display
const OLD_DETAILS = `      <div className="space-y-4 border-t border-brand-100 pt-6">
        <div className="flex justify-between text-sm">
          <span className="text-brand-600">Order Number:</span>
          <span className="font-mono font-medium">{order.id.slice(0, 8).toUpperCase()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-brand-600">Total:</span>
          <span className="font-bold text-lg">{formatCurrency(order.total, 'KES')}</span>
        </div>
      </div>`;

const NEW_DETAILS = `      {/* Order Items */}
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
      </div>

      {/* Order Summary */}
      <div className="space-y-3 border-t border-brand-200 pt-6 mt-6">
        <div className="flex justify-between text-sm">
          <span className="text-brand-600">Order Number:</span>
          <span className="font-mono font-medium">{order.id.slice(0, 8).toUpperCase()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-brand-600">Subtotal:</span>
          <span>{formatCurrency(order.subtotal, 'KES')}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-brand-600">Shipping:</span>
          <span>{formatCurrency(order.shipping_fee, 'KES')}</span>
        </div>
        <div className="flex justify-between text-lg font-bold text-brand-900 pt-3 border-t border-brand-200">
          <span>Total:</span>
          <span>{formatCurrency(order.total, 'KES')}</span>
        </div>
      </div>`;

if (!content.includes(OLD_DETAILS)) {
  console.log("ANCHOR NOT FOUND. Looking for the order details section...");
  process.exit(1);
}
content = content.split(OLD_DETAILS).join(NEW_DETAILS);

fs.writeFileSync(successPath, content, 'utf8');

console.log('✅ SUCCESS: Enhanced success page to show:');
console.log('   - Product names');
console.log('   - Quantities and unit prices');
console.log('   - Individual item totals');
console.log('   - Subtotal, shipping, and grand total breakdown');
console.log('\nRefresh the success page to see the full order details!');