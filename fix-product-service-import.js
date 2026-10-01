import fs from 'fs';
import path from 'path';

const servicePath = path.join('src', 'services', 'product.service.ts');

if (!fs.existsSync(servicePath)) {
  console.log('File not found:', servicePath);
  process.exit(1);
}

let c = fs.readFileSync(servicePath, 'utf8');

// Replace the old import with the new one
const oldImport = "import { createServerSupabaseClient } from '@/lib/supabase/server';";
const newImport = "import { createClient } from '@/lib/supabase/server';";

if (c.includes(oldImport)) {
  c = c.replace(oldImport, newImport);
  
  // Also replace the usage of the function inside the file
  c = c.replace(/createServerSupabaseClient\(\)/g, 'await createClient()');
  
  fs.writeFileSync(servicePath, c, 'utf8');
  console.log('✅ Fixed import and usage in product.service.ts');
} else {
  console.log('Could not find the exact old import. Checking current content...');
  console.log(c.substring(0, 200)); // Print first 200 chars to debug
}