import fs from 'fs';
import path from 'path';

const clientPath = path.join('src', 'lib', 'supabase', 'client.ts');

const content = `import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
`;

fs.mkdirSync(path.dirname(clientPath), { recursive: true });
fs.writeFileSync(clientPath, content, 'utf8');
console.log('✅ Fixed client.ts to use createBrowserClient.');