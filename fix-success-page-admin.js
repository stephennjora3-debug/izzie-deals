import fs from 'fs';
import path from 'path';

const successPath = path.join(process.cwd(), 'src', 'app', '(shop)', 'checkout', 'success', 'page.tsx');

console.log('Updating success page to use admin client...\n');

let content = fs.readFileSync(successPath, 'utf8');

// ANCHOR 1: Change import from createClient to createAdminClient
const OLD_IMPORT = `import { createClient } from '@/lib/supabase/server';`;
const NEW_IMPORT = `import { createAdminClient } from '@/lib/supabase/admin';`;

if (!content.includes(OLD_IMPORT)) {
  console.log("ANCHOR 1 NOT FOUND (createClient import)");
  process.exit(1);
}
content = content.split(OLD_IMPORT).join(NEW_IMPORT);

// ANCHOR 2: Change client initialization in OrderDetails component
const OLD_CLIENT = `async function OrderDetails({ orderId }: { orderId: string }) {
  const supabase = await createClient();`;

const NEW_CLIENT = `async function OrderDetails({ orderId }: { orderId: string }) {
  const supabase = createAdminClient(); // Use admin client to bypass RLS for viewing order`;

if (!content.includes(OLD_CLIENT)) {
  console.log("ANCHOR 2 NOT FOUND (OrderDetails function)");
  process.exit(1);
}
content = content.split(OLD_CLIENT).join(NEW_CLIENT);

fs.writeFileSync(successPath, content, 'utf8');

console.log('✅ SUCCESS: Updated success page to use admin client.');
console.log('   This will bypass RLS and allow viewing order details.');
console.log('   Refresh the success page to see the order confirmation!');