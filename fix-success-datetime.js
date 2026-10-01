import fs from 'fs';
import path from 'path';

const successPath = path.join(process.cwd(), 'src', 'app', '(shop)', 'checkout', 'success', 'page.tsx');

console.log('Adding order date and time to success page...\n');

let content = fs.readFileSync(successPath, 'utf8');

// ANCHOR 1: Add a helper function to format date
const OLD_IMPORTS = `import { Suspense } from 'react';
import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase/admin';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import CartClearer from '@/components/cart/CartClearer';`;

const NEW_IMPORTS = `import { Suspense } from 'react';
import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase/admin';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import CartClearer from '@/components/cart/CartClearer';

// Helper function to format date and time
function formatOrderDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('en-KE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}`;

if (!content.includes(OLD_IMPORTS)) {
  console.log("ANCHOR 1 NOT FOUND (Imports section)");
  process.exit(1);
}
content = content.split(OLD_IMPORTS).join(NEW_IMPORTS);

// ANCHOR 2: Add Order Date/Time after Order Number
const OLD_ORDER_NUMBER = `        <div className="flex justify-between text-sm">
          <span className="text-brand-600">Order Number:</span>
          <span className="font-mono font-medium">{order.id.slice(0, 8).toUpperCase()}</span>
        </div>`;

const NEW_ORDER_NUMBER_DATE = `        <div className="flex justify-between text-sm">
          <span className="text-brand-600">Order Number:</span>
          <span className="font-mono font-medium">{order.id.slice(0, 8).toUpperCase()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-brand-600">Order Date:</span>
          <span className="text-brand-900">{formatOrderDateTime(order.created_at)}</span>
        </div>`;

if (!content.includes(OLD_ORDER_NUMBER)) {
  console.log("ANCHOR 2 NOT FOUND (Order Number section)");
  process.exit(1);
}
content = content.split(OLD_ORDER_NUMBER).join(NEW_ORDER_NUMBER_DATE);

fs.writeFileSync(successPath, content, 'utf8');

console.log('✅ SUCCESS: Added order date and time to success page');
console.log('   The order confirmation now shows when the purchase was made.');
console.log('\nRefresh the success page to see the date and time!');