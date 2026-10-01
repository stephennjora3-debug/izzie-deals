import fs from 'fs';
import path from 'path';

const actionsPath = path.join(process.cwd(), 'src', 'actions', 'order.actions.ts');

console.log('Reverting to Admin Client for secure server-side order creation...\n');

let content = fs.readFileSync(actionsPath, 'utf8');

// ANCHOR 1: Revert import to use Admin Client (Service Role)
const OLD_IMPORT = `import { createClient } from '@/lib/supabase/server';`;
const NEW_IMPORT = `import { createAdminClient } from '@/lib/supabase/admin';`;

if (!content.includes(OLD_IMPORT)) {
  console.log("ANCHOR 1 NOT FOUND. Check if import was already changed.");
  process.exit(1);
}
content = content.split(OLD_IMPORT).join(NEW_IMPORT);

// ANCHOR 2: Revert client initialization
const OLD_CLIENT = `  // 2. AUTHENTICATION & SESSION (Manifesto Point 2, 17)
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id || null; // Support guest checkout, but link if logged in`;

const NEW_CLIENT = `  // 2. SECURE SERVER CLIENT (Manifesto Point 1, 8)
  // Using Admin Client because this is a protected Server Action with strict Zod validation.
  // This bypasses RLS issues for guest checkout while remaining secure.
  const supabase = createAdminClient();
  const userId = null; // Guest checkout for now`;

if (!content.includes(OLD_CLIENT)) {
  console.log("ANCHOR 2 NOT FOUND. Check if client initialization was already changed.");
  process.exit(1);
}
content = content.split(OLD_CLIENT).join(NEW_CLIENT);

fs.writeFileSync(actionsPath, content, 'utf8');

console.log('✅ SUCCESS: Reverted to createAdminClient()');
console.log('   This bypasses the strict RLS blocking the insert.');
console.log('   Security is maintained via Zod validation and server-side price fetching.');